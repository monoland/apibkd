<?php

namespace App\Http\Controllers\Simpeg;

use App\Http\Controllers\Controller;
use App\Http\Resources\SimpegResource;
use App\Models\Simpeg;
use Illuminate\Http\Request;

class SimpegController extends Controller
{
    /**
     * Undocumented function
     *
     * @param Request $request
     * @return void
     */
    public function show(Request $request, $nip)
    {
        return Simpeg::getBiodata($request);
    }
}
