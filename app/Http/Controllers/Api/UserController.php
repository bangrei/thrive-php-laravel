<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;

use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $limit = request()->query('limit');
        $page = request()->query('page');

        $users = Cache::remember('users_page_'.$page, now()->addMinutes(60), function () use($limit) {
            return User::query()->where('role','<>', null)->orderBy('id', 'desc')->paginate($limit);
        });

        return UserResource::collection($users);
        
        // return UserResource::collection(
        //     User::query()->where('role','<>', null)->orderBy('id', 'desc')->paginate($limit)
        // );
    }

    public function search()
    {
        $key = request()->input('key');

        $users = Cache::remember('users_search_'.$key, now()->addMinutes(5), function () use($key) {
            return User::query()->where('name','LIKE', "%{$key}%")->orWhere('email', 'LIKE', "%{$key}%")->orderBy('id', 'desc')->get();
        });

        $users = UserResource::collection($users);

        return response(compact('users','key'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        if(isset($data['password'])) $data['password'] = bcrypt($data['password']);

        $user->update($data);

        return response(new UserResource($user));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response("", 204);
    }
}
