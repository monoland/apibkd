<?php

namespace App\Http\Controllers\Mono;

use App\Models\Media;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MediaController extends Controller
{
    /**
     * Undocumented function
     *
     * @param Request $request
     * @return void
     */
    public function store(Request $request)
    {
        if (!$request->has('completed')) {
            return Media::storeChunk($request);
        }

        return Media::combineChunk($request);
    }
}
