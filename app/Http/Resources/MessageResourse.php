<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResourse extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message' => $this->message,
            'username' => $this->username,
            'receiver' => $this->receiver,
            'created_date' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'created_time' => $this->created_at ? $this->created_at->format('H:i:s') : null,
            'created_date_display' => $this->created_at ? $this->created_at->format('d M Y') : null,
            'created_time_display' => $this->created_at ? $this->created_at->format('H:i') : null,
        ];
    }
}
