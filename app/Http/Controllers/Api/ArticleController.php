<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;

// use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $limit = request()->query('limit');
        $page = request()->query('page');

        // $cached = Redis::get('articles_' . $page . '_'. $limit);
        // if(isset($cached)){
        //     $cachedArticles = json_decode($cached, FALSE);
        //     return new ArticleResource($cachedArticles);
        // }
        // Redis::set('articles_' . $page . '_'. $limit);
        // return ArticleResource::collection(
        //     Article::query()->where('id','<>', null)->orderBy('id', 'desc')->paginate($limit)
        // );

        $articles = Cache::remember('articles_page_'.$page, now()->addMinutes(60), function () use($limit) {
            return Article::query()->where('id','<>', null)->orderBy('id', 'desc')->paginate($limit);
        });
        return ArticleResource::collection($articles);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $data = $request->validated();

        $article = Article::create($data);

        return response(new ArticleResource($article), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Article $article)
    {
        return new ArticleResource($article);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, Article $article)
    {
        $data = $request->validated();

        $article->update($data);

        return response(new ArticleResource($article));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return response("", 204);
    }
}
