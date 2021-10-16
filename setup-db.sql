create user scribbler with password 'scribbler1234';
drop database IF EXISTS scribble_backend;
drop database IF EXISTS scribble_backend_test;
create database scribble_backend owner scribbler;
create database scribble_backend_test owner scribbler;