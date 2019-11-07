<?php

namespace App\Http\Controllers\Mono;

use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\SettingResource;

class WebController extends Controller
{
    /**
     * Undocumented function.
     */
    public function index()
    {
        return view('default');
    }

    /**
     * Undocumented function.
     *
     * @param Request $request
     */
    public function user(Request $request)
    {
        return new UserResource($request->user());
    }

    /**
     * Undocumented function.
     *
     * @param Request $request
     */
    public function profile(Request $request)
    {
        return User::updateRecord($request, $request->user());
    }

    /**
     * Undocumented function.
     *
     * @param Request $request
     */
    public function password(Request $request)
    {
        $this->validate($request, [
            'old_password' => 'required|old_password',
            'password' => 'confirmed|max:8|different:old_password',
        ]);

        return User::updatePassword($request, $request->user());
    }

    /**
     * Undocumented function.
     *
     * @param Request $request
     */
    public function company(Request $request)
    {
        return new SettingResource(Setting::find('company'));
    }

    /**
     * Undocumented function.
     *
     * @param Request $request
     */
    public function menus(Request $request)
    {
        switch ($request->user()->authent->name) {
            case 'administrator':
                return response()->json([
                    'deskbar' => [
                        ['type' => 'item', 'icon' => 'dashboard', 'text' => 'Beranda', 'to' => ['name' => 'home']],
                        // master
                        ['type' => 'subheader', 'text' => 'Master', 'class' => 'mt-2'],
                        ['type' => 'item', 'icon' => 'filter_none', 'text' => 'Dokumen', 'to' => ['name' => 'document']],
                        // utilitas
                        ['type' => 'subheader', 'text' => 'Utilitas', 'class' => 'mt-2'],
                        ['type' => 'item', 'icon' => 'people', 'text' => 'Pengguna', 'to' => ['name' => 'user']],
                        ['type' => 'item', 'icon' => 'whatshot', 'text' => 'OAuth Klien', 'to' => ['name' => 'client']],
                    ],
                    'mobibar' => [
                        // master
                        ['type' => 'subheader', 'text' => 'Master', 'class' => 'mt-2'],
                        ['type' => 'item', 'icon' => 'filter_none', 'text' => 'Dokumen', 'to' => ['name' => 'document']],
                        // utilitas
                        ['type' => 'subheader', 'text' => 'Utilitas', 'class' => 'mt-2'],
                        ['type' => 'item', 'icon' => 'people', 'text' => 'Pengguna', 'to' => ['name' => 'user']],
                        ['type' => 'item', 'icon' => 'whatshot', 'text' => 'OAuth Klien', 'to' => ['name' => 'client']],
                    ],
                    'homebar' => [
                        ['type' => 'item', 'icon' => 'dashboard', 'text' => 'Beranda', 'to' => ['name' => 'home']],
                        ['type' => 'item', 'icon' => 'perm_identity', 'text' => 'Profile', 'to' => ['name' => 'profile']],
                        ['type' => 'item', 'icon' => 'lock', 'text' => 'Katasandi', 'to' => ['name' => 'password']],
                        ['type' => 'item', 'icon' => 'settings', 'text' => 'Setting', 'to' => ['name' => 'setting']],
                    ],
                    'account' => [
                        ['type' => 'item', 'icon' => 'perm_identity', 'text' => 'Profile', 'to' => ['name' => 'profile']],
                        ['type' => 'item', 'icon' => 'lock', 'text' => 'Katasandi', 'to' => ['name' => 'password']],
                        ['type' => 'item', 'icon' => 'settings', 'text' => 'Setting', 'to' => ['name' => 'setting']],
                    ],
                ]);
                break;

            default:
                return response()->json([
                    'deskbar' => [
                        ['type' => 'item', 'icon' => 'dashboard', 'text' => 'Beranda', 'to' => ['name' => 'home']],
                    ],
                    'mobibar' => [],
                    'homebar' => [],
                    'account' => [
                        ['type' => 'item', 'icon' => 'perm_identity', 'text' => 'Profile', 'to' => ['name' => 'profile']],
                        ['type' => 'item', 'icon' => 'lock', 'text' => 'Katasandi', 'to' => ['name' => 'password']],
                    ],
                ]);
                break;
        }
    }
}
