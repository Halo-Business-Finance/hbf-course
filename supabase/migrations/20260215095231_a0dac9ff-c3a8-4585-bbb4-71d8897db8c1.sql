-- Populate course_modules from course_content_modules
-- This is a data insert using existing content module data
INSERT INTO public.course_modules (module_id, title, description, skill_level, duration, lessons_count, order_index, is_active, course_id, created_at, updated_at)
SELECT 
  ccm.id as module_id,
  ccm.title,
  ccm.description,
  CASE 
    WHEN c.level = 'expert' THEN 'expert'::skill_level
    ELSE 'beginner'::skill_level
  END as skill_level,
  ccm.duration,
  ccm.lessons_count,
  ccm.order_index,
  ccm.is_active,
  ccm.course_id,
  COALESCE(ccm.created_at, now()),
  COALESCE(ccm.updated_at, now())
FROM public.course_content_modules ccm
LEFT JOIN public.courses c ON c.id = ccm.course_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.course_modules cm WHERE cm.module_id = ccm.id
);

-- Set proper order_index on all courses
-- Group by category: SBA courses first, then by type, beginner before expert
UPDATE public.courses SET order_index = sub.new_order
FROM (
  SELECT id, ROW_NUMBER() OVER (
    ORDER BY 
      CASE 
        WHEN id LIKE 'sba-7a%' THEN 1
        WHEN id LIKE 'sba-504%' THEN 2
        WHEN id LIKE 'sba-express%' THEN 3
        WHEN id LIKE 'sba-loan%' THEN 4
        WHEN id LIKE 'commercial-real-estate%' THEN 5
        WHEN id LIKE 'construction%' THEN 6
        WHEN id LIKE 'equipment%' THEN 7
        WHEN id LIKE 'business-lines%' THEN 8
        WHEN id LIKE 'asset-based%' THEN 9
        WHEN id LIKE 'invoice%' THEN 10
        WHEN id LIKE 'merchant%' THEN 11
        WHEN id LIKE 'working-capital%' THEN 12
        WHEN id LIKE 'franchise%' THEN 13
        WHEN id LIKE 'healthcare%' THEN 14
        WHEN id LIKE 'restaurant%' THEN 15
        WHEN id LIKE 'bridge%' THEN 16
        WHEN id LIKE 'apartment%' THEN 17
        WHEN id LIKE 'agriculture%' THEN 18
        WHEN id LIKE 'usda%' THEN 19
        WHEN id LIKE 'commercial-loan%' THEN 20
        ELSE 99
      END,
      CASE WHEN level = 'beginner' THEN 0 ELSE 1 END,
      id
  ) as new_order
  FROM public.courses
) sub
WHERE public.courses.id = sub.id;