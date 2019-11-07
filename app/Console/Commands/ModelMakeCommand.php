<?php

namespace App\Console\Commands;

use Illuminate\Support\Str;
use Illuminate\Console\GeneratorCommand;
use Symfony\Component\Console\Input\InputOption;

class ModelMakeCommand extends GeneratorCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'mono:model';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Eloquent model class';

    /**
     * The type of class being generated.
     *
     * @var string
     */
    protected $type = 'Model';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        if (parent::handle() === false && !$this->option('force')) {
            return;
        }

        if ($this->option('all')) {
            $this->input->setOption('migration', true);
            $this->input->setOption('policy', true);
            $this->input->setOption('resource', true);
        }

        if ($this->option('migration')) {
            $this->createMigration();
        }

        if ($this->option('policy')) {
            $this->createPolicy();
        }

        if ($this->option('resource')) {
            $this->createResource();
        }
    }

    /**
     * Create a migration file for the model.
     *
     * @return void
     */
    protected function createMigration()
    {
        $table = Str::plural(Str::snake(class_basename($this->argument('name'))));

        // if ($this->option('pivot')) {
        //     $table = Str::singular($table);
        // }

        $this->call('mono:migration', [
            'name' => "create_{$table}_table",
            '--create' => $table,
        ]);
    }

    /**
     * Create a policy for the model.
     *
     * @return void
     */
    protected function createPolicy()
    {
        $policy = Str::studly(class_basename($this->argument('name')));

        $modelName = $this->qualifyClass($this->getNameInput());

        $this->call('mono:policy', [
            'name' => "{$policy}Policy",
            '--model' => "Models/{$policy}",
        ]);
    }

    protected function createResource()
    {
        $className = Str::studly(class_basename($this->argument('name')));

        $this->call('mono:resource', [
            'name' => "{$className}Resource"
        ]);

        $this->call('mono:resource', [
            'name' => "{$className}Collection"
        ]);
    }

    /**
     * Get the stub file for the generator.
     *
     * @return string
     */
    protected function getStub()
    {
        // if ($this->option('pivot')) {
        //     return __DIR__ . '/stubs/pivot.model.stub';
        // }

        return __DIR__ . '/stubs/model.stub';
    }

    /**
     * Get the default namespace for the class.
     *
     * @param  string  $rootNamespace
     * @return string
     */
    protected function getDefaultNamespace($rootNamespace)
    {
        return $rootNamespace;
    }

    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['all', 'a', InputOption::VALUE_NONE, 'Generate a migration, factory, and resource controller for the model'],

            ['force', null, InputOption::VALUE_NONE, 'Create the class even if the model already exists'],

            ['migration', 'm', InputOption::VALUE_NONE, 'Create a new migration file for the model'],

            ['policy', 'p', InputOption::VALUE_NONE, 'Create a new policy file for the model'],

            ['resource', 'r', InputOption::VALUE_NONE, 'Indicates if the generated an resource'],
        ];
    }
}
