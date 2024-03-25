CREATE DEFINER=`root`@`%` PROCEDURE `UpadteAlbumSongData`(IN `valbumId` bigint)
BEGIN
  if valbumId=0 Or valbumId is null then
		WITH temp_update_table AS (
			SELECT albumId, songLength
			FROM albuminfo
		)
		UPDATE albuminfo 
		SET albuminfo.songLength=(select count(songinfo.songId) from songinfo where songinfo.albumId=albuminfo.albumId)
		where albuminfo.albumId=temp_update_table.albumId;
	else
	  WITH temp_update_table AS (
			SELECT albumId, songLength
			FROM albuminfo
			where albumId=valbumId
		)
		UPDATE albuminfo 
		SET albuminfo.songLength=(select count(songinfo.songId) from songinfo where songinfo.albumId=albuminfo.albumId)
		where albuminfo.albumId=temp_update_table.albumId;
	end if;

END