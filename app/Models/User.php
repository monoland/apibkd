<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'authent_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Undocumented function.
     */
    public function userable()
    {
        return $this->morphTo();
    }

    /**
     * Undocumented function.
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    /**
     * Undocumented function.
     */
    public function authent()
    {
        return $this->belongsTo(Authent::class);
    }

    /**
     * Undocumented function.
     *
     * @return bool
     */
    public function isAdministrator()
    {
        return $this->authent->name === 'administrator';
    }

    /**
     * Scope for filter.
     */
    public function scopeFilterOn($query, $request)
    {
        $sortaz = $request->sortDesc === 'true' ? 'desc' : 'asc';
        $sortby = $request->has('sortBy') ? $request->sortBy : null;
        $search = $request->has('search') ? strtolower($request->search) : null;

        $mixquery = $query;

        if ($search) {
            $mixquery = $mixquery->whereRaw("LOWER(name) LIKE '%{$search}%'");
        }

        if ($sortby) {
            $mixquery = $mixquery->orderBy($sortby, $sortaz);
        }

        return $mixquery;
    }

    /**
     * Store.
     */
    public static function storeRecord($request)
    {
        DB::beginTransaction();

        try {
            $model = new static();
            $model->name = $request->name;
            $model->email = $request->email;
            $model->authent_id = $request->authent_id;
            $model->password = Hash::make('12345678');
            $model->theme = 'blue-grey';
            $model->avatar = '/images/user-holder.png';
            $model->background = '/images/draw-holder.svg';
            $model->save();

            DB::commit();

            return new UserResource($model);
        } catch (\Exception $e) {
            DB::rollBack();

            abort(500, $e->getMessage());
        }
    }

    /**
     * Update.
     */
    public static function updateRecord($request, $model)
    {
        DB::beginTransaction();

        try {
            if ($request->has('name')) {
                $model->name = $request->name;
            }

            if ($request->has('email')) {
                $model->email = $request->email;
            }

            if ($request->has('avatar')) {
                $model->avatar = $request->avatar;
            }

            if ($request->has('background')) {
                $model->background = $request->background;
            }

            if ($request->has('authorization')) {
                $model->authorization = $request->authorization;
            }

            if ($request->has('theme')) {
                $model->theme = $request->theme;
            }

            $model->save();

            DB::commit();

            return new UserResource($model);
        } catch (\Exception $e) {
            DB::rollBack();

            abort(500, $e->getMessage());
        }
    }

    /**
     * changePassword.
     */
    public static function updatePassword($request, $model)
    {
        DB::beginTransaction();

        try {
            $model->fill([
                'password' => Hash::make($request->password),
            ])->save();

            DB::commit();

            return response()->json([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            abort(500, $e->getMessage());
        }
    }

    /**
     * Destroy.
     */
    public static function destroyRecord($model)
    {
        DB::beginTransaction();

        try {
            $model->delete();

            DB::commit();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();

            abort(500, $e->getMessage());
        }
    }

    /**
     * Bulks.
     */
    public static function bulkDelete($request, $model = null)
    {
        DB::beginTransaction();

        try {
            $bulks = array_column($request->all(), 'id');
            $rests = (new static())->whereIn('id', $bulks)->delete();

            DB::commit();

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            DB::rollBack();

            abort(500, $e->getMessage());
        }
    }
}
