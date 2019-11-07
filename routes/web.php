<?php

Route::middleware('guest')->group(function () {
    Route::get('/', 'Mono\WebController@index');
});