<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

use App\Models\Message;

class ChatEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $message;
    public $username;
    public $receiver;
    public $id;
    public $created_date;
    public $created_time;

    public $created_date_display;
    public $created_time_display;

    public function __construct($message, $username, $receiver, $id)
    {
        $this->message = $message;
        $this->username = $username;
        $this->receiver = $receiver;
        $this->id = $id;

        $now = now("Asia/Jakarta");
        $this->created_date = $now->format('Y-m-d');
        $this->created_time = $now->format('H:i:s');

        $this->created_date_display = $now->format('d M Y');
        $this->created_time_display = $now->format('H:i');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $myRoom = "chat_".$this->username;
        $yourRoom = "chat_".$this->receiver;
        return [
            $myRoom,
            $yourRoom
        ];
    }

    public function broadcastAs(){
        return 'message_'.$this->username;
    }
}
