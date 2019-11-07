<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SettingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            $this->mergeWhen($this->id === 'company', [
                'name' => $this->name,
                'title' => $this->title,
                'quote' => $this->quote,
                'logo' => $this->logo,
                'background' => $this->background,
                'height' => $this->height,
                'width' => $this->width,
            ]),
            'updated_at' => (string) $this->updated_at,
        ];
    }
}
