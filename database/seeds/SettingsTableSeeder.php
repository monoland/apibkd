<?php

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $model = new Setting();
        $model->id = 'company';
        $model->name = '<span class="headline font-weight-light">Monoland</span><span class="headline font-weight-bold">Awesome</span>';
        $model->title = '<div class="d-block display-1 text-uppercase"><span class="font-weight-light">let\'s build</span><span class="font-weight-bold"> awesome apps</span></div>';
        $model->quote = '<span class="d-block">Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque numquam facilis assumenda dicta nihil ut aperiam vero blanditiis, cupiditate, natus, sint temporibus est odio molestias necessitatibus fuga dolore! Doloribus, cupiditate!</span>';
        $model->logo = '/images/logo-holder.png';
        $model->background = '/images/back-holder.jpg';
        $model->height = '120px';
        $model->width = '120px';
        $model->save();
    }
}
