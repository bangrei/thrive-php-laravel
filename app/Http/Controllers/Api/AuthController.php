<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        try {
            $data = $request->validated();

            /** @var \App\Models\User $user */
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'role' => $data['role'],
                'password' => bcrypt($data['password']),
            ]);

            $token = $user->createToken('main')->plainTextToken;
            $success = true;

            return response(compact('user','token','success'));
        } catch (Exception $e) {
            return response([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $credentials = $request->validated();

            if(!Auth::attempt($credentials)) {
                return response([
                    'message' => 'Provided email address or password is incorrect'
                ], 422);
            }

            /** @var \App\Models\User $user */
            $user = Auth::user();
            $token = $user->createToken('main')->plainTextToken;
            $success = true;
            return response(compact('user','token','success'));
        } catch(Exception $e) {
            return response([
                'message' => $e->getMessage()
            ], 422);
        }
    }

    public function logout(Request $request)
    {
        try {
            /** @var \App\Models\User $user */
            $user = $request->user();
            $user->currentAccessToken()->delete();

            return response([
                'logout' => true
            ]);
        } catch(Exception $e) {
            return response([
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
