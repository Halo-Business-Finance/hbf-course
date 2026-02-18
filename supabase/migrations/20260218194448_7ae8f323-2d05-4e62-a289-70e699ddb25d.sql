
-- Delete clearly irrelevant/spam videos
DELETE FROM course_videos
WHERE 
  title ILIKE '%psychometric%' OR
  title ILIKE '%crypto%' OR
  title ILIKE '%bybit%' OR
  title ILIKE '%futures trading%' OR
  title ILIKE '%interview question%' OR
  title ILIKE '%job interview%' OR
  title ILIKE '%progress tracker%' OR
  title ILIKE '%excel%' OR
  title ILIKE '%staffing firm%' OR
  title ILIKE '%corporate finance%' OR
  title ILIKE '%day in the life%' OR
  title ILIKE '%Finance Interview%';

-- Delete duplicate videos per module — keep only the most relevant one
-- (the one with a youtube_id that was most recently assigned)
DELETE FROM course_videos
WHERE id IN (
  SELECT id FROM (
    SELECT 
      id,
      module_id,
      ROW_NUMBER() OVER (PARTITION BY module_id ORDER BY 
        CASE WHEN youtube_id IS NOT NULL THEN 0 ELSE 1 END,
        created_at DESC
      ) AS rn
    FROM course_videos
  ) ranked
  WHERE rn > 1
);
