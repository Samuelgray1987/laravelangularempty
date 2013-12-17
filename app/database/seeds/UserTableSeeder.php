<?php

class UserTableSeeder extends Seeder {

	
	public function run()
	{
		DB::table('users')->delete();
		$users = array(
			array(
				'email' => 'samuelgray1987@gmail.com',
				'password' => Hash::make('admin'),
				'created_at' => new DateTime,
				'updated_at' => new DateTime
				)
			);
		DB::table('users')->insert( $users );
	}

}