<?php

namespace App\Http\Controllers\Api;

use App\Events\ChatEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\MessageResourse;

use App\Http\Requests\MessageRequest;
use App\Models\Message;

use Illuminate\Support\Facades\Cache;

class ChatController extends Controller
{
    public function message(MessageRequest $request) {
        $data = $request->validated();

        $saved = Message::create($data);

        event(new ChatEvent($saved->message, $saved->username, $saved->receiver, $saved->id));

        return [];
    }

    public function getMessages($from, $to) {
        $where1 = ['username' => $from, 'receiver' => $to];
        $where2 = ['username' => $to, 'receiver' => $from];

        $chats = MessageResourse::collection(
            Message::query()->where($where1)->orWhere($where2)->orderBy('id', 'asc')->get()
        );

        return response($chats);
    }
}
