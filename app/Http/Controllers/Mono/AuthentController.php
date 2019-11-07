<?php

namespace App\Http\Controllers\Mono;

use App\Models\Authent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuthentController extends Controller
{
    /**
     * Display a listing for combo
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function combo(Request $request)
    {
        return Authent::fetchCombo($request);
    }
}
