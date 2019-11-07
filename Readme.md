### Monoland Awesome Framework

monoland awesome framework adalah penggabungan antara laravel framework dengan vuejs + vuetify.

cara install:
```
    composer create-project monoland/awesome [your-project-name]
```

edit .env file, bila ingin mengganti default user dan password.
edit UsersTableSeeder di database->seeds
jalankan migrasi
```
    php artisan migrate:refresh --seed
```