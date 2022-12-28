create database onitomovies;
use onitomovies;

create table movies(
	tconst varchar(9),
    titleType varchar(255),
    primaryTitle varchar(255),
    runtimeMinutes integer,
    genres varchar(255)
);

create table ratings(
	tconst varchar(9),
    averageRating float(2,1),
    numVotes integer
);

select tconst, primaryTitle, runtimeMinutes, genres from movies order by runtimeMinutes desc limit 10;
select tconst from movies order by tconst desc limit 1;
delete from movies where tconst = "tt0000101";
select m.tconst, m.primaryTitle, m.genres, r.averageRating from movies as m inner join ratings as r where m.tconst = r.tconst and r.averageRating>6.0 order by r.averageRating desc;