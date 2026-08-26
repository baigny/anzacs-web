-- supabase/seed.sql
-- Seed content extracted from the live anzacs.in site (as of this rebuild).
-- NOTE: all 20 hybrid products below carry ANZ-verified agronomic figures
-- (confirmed 2026-08-26). The 10 open-pollinated lines (Carrot, Cauliflower,
-- Coriander, Peas, Tomato S-22, Onion, Basil) still have placeholder figures
-- and MUST be verified by ANZ before going live. See docs/PHASE_CHECKLIST.md
-- for the full list of content assumptions needing sign-off.

-- ---------------------------------------------------------------------
-- 1. Products + structured agronomy attributes
-- ---------------------------------------------------------------------
do $$
declare
  p jsonb;
  a jsonb;
  new_id uuid;
  products jsonb := '[
    {"section":"hybrid","crop":"Bottle Gourd","name":"F1-JULIA-008","slug":"bottle-gourd-f1-julia-008","regions":["South","Central"],"attrs":[
      {"label":"Maturity Duration","value":"50 to 55 days after sowing"},
      {"label":"Fruit Shape","value":"Long cylindrical"},
      {"label":"Fruit Length","value":"50 to 55 cm"},
      {"label":"Fruit Weight","value":"500 to 600 gm"},
      {"label":"Fruit Colour","value":"Light Green"},
      {"label":"Remarks","value":"Tender flesh, high yielding."}
    ]},
    {"section":"hybrid","crop":"Bottle Gourd","name":"F1-SOPHIA-003","slug":"bottle-gourd-f1-sophia-003","regions":["South","North"],"attrs":[
      {"label":"Maturity Duration","value":"45 to 50 days after sowing"},
      {"label":"Fruit Shape","value":"Cylindrical type"},
      {"label":"Fruit Length","value":"40 to 45 cm"},
      {"label":"Fruit Weight","value":"400 to 500 gm"},
      {"label":"Fruit Colour","value":"Light Green"},
      {"label":"Remarks","value":"Tender flesh, very high yielding."}
    ]},
    {"section":"hybrid","crop":"Okra","name":"F1-GLORY","slug":"okra-f1-glory","regions":["South","Central","North"],"attrs":[
      {"label":"Plant Height","value":"3 to 4 feet"},
      {"label":"Branches","value":"Very Good"},
      {"label":"Internodes","value":"Short"},
      {"label":"Fruit Length","value":"7 to 9 cm"},
      {"label":"Fruit Colour","value":"Dark Green"},
      {"label":"Disease Tolerance","value":"YVMV, good productivity"},
      {"label":"Fruit Yield","value":"Very High"},
      {"label":"Remarks","value":"Good keeping quality."}
    ]},
    {"section":"hybrid","crop":"Bitter Gourd","name":"F1-EURO","slug":"bitter-gourd-f1-euro","regions":["South","Central"],"attrs":[
      {"label":"Maturity Duration","value":"40 to 45 days after sowing"},
      {"label":"Fruit Shape","value":"Medium Smooth"},
      {"label":"Fruit Length","value":"12 to 15 cm"},
      {"label":"Fruit Weight","value":"100 to 120 gm"},
      {"label":"Fruit Colour","value":"Dark Green"},
      {"label":"Remarks","value":"High yielding and suitable for long-duration harvest."}
    ]},
    {"section":"hybrid","crop":"Bitter Gourd","name":"F1-POLO","slug":"bitter-gourd-f1-polo","regions":["South"],"attrs":[
      {"label":"Maturity Duration","value":"55 to 60 days after sowing"},
      {"label":"Fruit Shape","value":"Long Spindle"},
      {"label":"Fruit Length","value":"16 to 18 cm"},
      {"label":"Fruit Weight","value":"100 to 120 gm"},
      {"label":"Fruit Colour","value":"Dark Green"},
      {"label":"Remarks","value":"Good for long-distance transportation."}
    ]},
    {"section":"hybrid","crop":"Cucumber","name":"F1-DISCOVERY","slug":"cucumber-f1-discovery","regions":["South","Central","North","Pan India"],"attrs":[
      {"label":"Plant Habit","value":"Strong plant with dense foliage"},
      {"label":"Fruit Colour","value":"Light Green"},
      {"label":"Fruit Length","value":"18 to 20 cm"},
      {"label":"Fruit Diameter","value":"4 to 5 cm"},
      {"label":"Days of Maturity","value":"35 to 40 days"},
      {"label":"Fruit Weight","value":"400 to 500 gm"},
      {"label":"Remarks","value":"Excellent taste; CMV, PRSV, ZYMV disease resistance."}
    ]},
    {"section":"hybrid","crop":"Cucumber","name":"F1-POLY","slug":"cucumber-f1-poly","regions":["North","Central"],"attrs":[
      {"label":"Plant Habit","value":"Strong plant with dense foliage"},
      {"label":"Fruit Colour","value":"Light Green"},
      {"label":"Fruit Length","value":"18 to 20 cm"},
      {"label":"Fruit Diameter","value":"4 to 5 cm"},
      {"label":"Days of Maturity","value":"35 to 40 days"},
      {"label":"Fruit Weight","value":"400 to 500 gm"},
      {"label":"Remarks","value":"Excellent taste; CMV, PRSV, ZYMV disease resistance."}
    ]},
    {"section":"hybrid","crop":"Capsicum","name":"F1-GREEN","slug":"capsicum-f1-green","regions":["North","Central"],"attrs":[
      {"label":"Plant Height","value":"2.5 feet"},
      {"label":"Days to 1st Picking","value":"60 to 65 days after transplanting"},
      {"label":"Fruit Weight","value":"80 to 100 gm"},
      {"label":"Fruit Colour (Unripe)","value":"Green"},
      {"label":"Fruit Colour (Ripe)","value":"Red"},
      {"label":"Remarks","value":"Green blocky, high-yielding hybrid for Kharif, Rabi, and mild summer; suitable for indoor and open cultivation."}
    ]},
    {"section":"hybrid","crop":"Capsicum","name":"F1-WISDOM","slug":"capsicum-f1-wisdom","regions":["North"],"attrs":[
      {"label":"Plant Height","value":"3.5 feet"},
      {"label":"Days to 1st Picking","value":"55 to 60 days after transplanting"},
      {"label":"Fruit Weight","value":"100 to 110 gm"},
      {"label":"Fruit Colour (Unripe)","value":"Green"},
      {"label":"Fruit Colour (Ripe)","value":"Red"},
      {"label":"Remarks","value":"Blocky, 3-4 lobes, good colour; suitable for indoor cultivation."}
    ]},
    {"section":"hybrid","crop":"Ridge Gourd","name":"F1-LAILA","slug":"ridge-gourd-f1-laila","regions":["South","Central"],"attrs":[
      {"label":"Days to 1st Harvest","value":"40 to 50 days after sowing"},
      {"label":"Fruit Length","value":"55 to 60 cm"},
      {"label":"Fruit Colour","value":"Green"},
      {"label":"Seed Content","value":"Low"},
      {"label":"Fruit Weight","value":"120 to 130 gm"},
      {"label":"Remarks","value":"A dark green hybrid, suited to Kharif and summer season."}
    ]},
    {"section":"hybrid","crop":"Chilli","name":"F1-NAT","slug":"chilli-f1-nat","regions":["South","Central","North"],"attrs":[
      {"label":"Plant Height","value":"3 feet"},
      {"label":"Days to 1st Picking","value":"50 to 55 days after transplanting"},
      {"label":"Fruit Length","value":"14 to 16 cm"},
      {"label":"Fruit Diameter","value":"1 to 1.3 cm"},
      {"label":"Fruit Surface","value":"Medium Smooth"},
      {"label":"Fruit Colour (Unripe)","value":"Light Green"},
      {"label":"Fruit Colour (Ripe)","value":"Red"},
      {"label":"Pungency","value":"Highly Pungent"},
      {"label":"Remarks","value":"Branches well with good flowering and fruit set; suitable for fresh green use, easy harvesting."}
    ]},
    {"section":"hybrid","crop":"Chilli","name":"F1-ZEIDAN","slug":"chilli-f1-zeidan","regions":["Central"],"attrs":[
      {"label":"Plant Height","value":"3 feet"},
      {"label":"Days to 1st Picking","value":"60 to 65 days after transplanting"},
      {"label":"Fruit Length","value":"13 to 15 cm"},
      {"label":"Fruit Diameter","value":"1 to 1.2 cm"},
      {"label":"Fruit Surface","value":"Smooth"},
      {"label":"Fruit Colour (Unripe)","value":"Dark Green"},
      {"label":"Fruit Colour (Ripe)","value":"Red"},
      {"label":"Pungency","value":"Highly Pungent"},
      {"label":"Remarks","value":"Good for the fresh market; suitable for rainy, mild winter seasons, and good heat tolerance."}
    ]},
    {"section":"hybrid","crop":"Chilli","name":"F1-BILL","slug":"chilli-f1-bill","regions":["South"],"attrs":[
      {"label":"Plant Height","value":"3.5 feet"},
      {"label":"Days to 1st Picking","value":"60 to 65 days after transplanting"},
      {"label":"Fruit Length","value":"14 to 16 cm"},
      {"label":"Fruit Diameter","value":"1 to 1.2 cm"},
      {"label":"Fruit Surface","value":"Smooth"},
      {"label":"Fruit Colour (Unripe)","value":"Dark Green"},
      {"label":"Fruit Colour (Ripe)","value":"Red"},
      {"label":"Pungency","value":"Highly Pungent"},
      {"label":"Remarks","value":"Long fruits with very high pungency; grows in rainy, summer, and mild winter season."}
    ]},
    {"section":"hybrid","crop":"Watermelon","name":"F1-HONEY-852","slug":"watermelon-f1-honey-852","regions":["South","Central","North"],"attrs":[
      {"label":"Maturity","value":"80 to 85 days after sowing"},
      {"label":"Fruit Weight","value":"12 to 15 kg"},
      {"label":"Flesh Colour","value":"Light green with dark green stripes, bright red, sweet and crispy flesh"},
      {"label":"Fruit Shape","value":"Oblong"},
      {"label":"Remarks","value":"Vigorous plant with strong vines protecting against sunburn; good for long transport."}
    ]},
    {"section":"hybrid","crop":"Watermelon","name":"F1-BABY","slug":"watermelon-f1-baby","regions":["South"],"attrs":[
      {"label":"Maturity","value":"60 to 65 days after sowing"},
      {"label":"Fruit Weight","value":"5 to 6 kg"},
      {"label":"Flesh Colour","value":"Black outside with red and juicy flesh"},
      {"label":"Fruit Shape","value":"Oblong"},
      {"label":"Remarks","value":"Easy to grow with good fruit setting."}
    ]},
    {"section":"hybrid","crop":"Tomato","name":"F1-ROME-50","slug":"tomato-f1-rome-50","regions":["South","Central","North","Pan India"],"attrs":[
      {"label":"Plant Habit","value":"Determinate"},
      {"label":"Maturity","value":"70 to 75 days"},
      {"label":"Fruit Shoulder","value":"Light Green"},
      {"label":"Fruit Weight","value":"80 to 90 gm"},
      {"label":"Fruit Shape","value":"Round"},
      {"label":"Fruit Firmness","value":"Good"}
    ]},
    {"section":"hybrid","crop":"Tomato","name":"F1-GORE-55","slug":"tomato-f1-gore-55","regions":["Central","North"],"attrs":[
      {"label":"Plant Habit","value":"Determinate"},
      {"label":"Maturity","value":"70 to 75 days"},
      {"label":"Fruit Shoulder","value":"Uniform Green"},
      {"label":"Fruit Weight","value":"90 to 100 gm"},
      {"label":"Fruit Shape","value":"Oval"},
      {"label":"Fruit Firmness","value":"Excellent"},
      {"label":"Disease Tolerance","value":"TYLCV"},
      {"label":"Remarks","value":"Medium to early hybrid, heat tolerant, good for long-distance transportation."}
    ]},
    {"section":"hybrid","crop":"Tomato","name":"F1-MORIYAN","slug":"tomato-f1-moriyan","regions":["South"],"attrs":[
      {"label":"Plant Habit","value":"Determinate"},
      {"label":"Maturity","value":"60 to 65 days"},
      {"label":"Fruit Shoulder","value":"Uniform Green"},
      {"label":"Fruit Weight","value":"80 to 90 gm"},
      {"label":"Fruit Shape","value":"Oval"},
      {"label":"Fruit Firmness","value":"Excellent"},
      {"label":"Remarks","value":"Medium to early hybrid, excellent firmness, suitable for rainy, Kharif and Rabi season."}
    ]},
    {"section":"hybrid","crop":"Tomato","name":"F1-KING","slug":"tomato-f1-king","regions":["South","Central"],"attrs":[
      {"label":"Plant Habit","value":"Indeterminate"},
      {"label":"Maturity","value":"65 to 70 days"},
      {"label":"Fruit Shoulder","value":"Uniform Green"},
      {"label":"Fruit Weight","value":"90 to 100 gm"},
      {"label":"Fruit Shape","value":"Round"},
      {"label":"Fruit Firmness","value":"Excellent"},
      {"label":"Remarks","value":"Good fruit quality."}
    ]},
    {"section":"hybrid","crop":"Cabbage","name":"F1-DOLPHIN","slug":"cabbage-f1-dolphin","regions":["North","Central"],"attrs":[
      {"label":"Days to Maturity","value":"80 to 85 days"},
      {"label":"Head Shape","value":"Flat Round"},
      {"label":"Head Colour","value":"Green"},
      {"label":"Head Weight","value":"2 to 2.5 kg"},
      {"label":"Remarks","value":"Heat tolerant with excellent field standing ability."}
    ]},
    {"section":"open_pollinated","crop":"Carrot","name":"Red Core","slug":"carrot-red-core","regions":["North","Central"],"attrs":[
      {"label":"Maturity Duration","value":"90-100 days from sowing"},
      {"label":"Root Colour","value":"Deep orange-red core"},
      {"label":"Root Length","value":"15-18 cm"},
      {"label":"Remarks","value":"Traditional open-pollinated variety, good for saved seed"}
    ]},
    {"section":"open_pollinated","crop":"Carrot","name":"Kuroda","slug":"carrot-kuroda","regions":["South","Central"],"attrs":[
      {"label":"Maturity Duration","value":"95-105 days from sowing"},
      {"label":"Root Colour","value":"Bright orange"},
      {"label":"Root Length","value":"16-20 cm"},
      {"label":"Remarks","value":"Widely grown export-oriented type"}
    ]},
    {"section":"open_pollinated","crop":"Carrot","name":"Early-NAT","slug":"carrot-early-nat","regions":["South"],"attrs":[
      {"label":"Maturity Duration","value":"80-85 days from sowing"},
      {"label":"Root Colour","value":"Orange"},
      {"label":"Root Length","value":"12-14 cm"},
      {"label":"Remarks","value":"Early maturing, suited to short-season planting"}
    ]},
    {"section":"open_pollinated","crop":"Cauliflower","name":"No.36","slug":"cauliflower-no-36","regions":["North","Central"],"attrs":[
      {"label":"Maturity Duration","value":"75-80 days from transplanting"},
      {"label":"Curd Colour","value":"White"},
      {"label":"Curd Weight","value":"800g - 1 kg"},
      {"label":"Remarks","value":"Classic mid-season variety"}
    ]},
    {"section":"open_pollinated","crop":"Cauliflower","name":"Mori","slug":"cauliflower-mori","regions":["North"],"attrs":[
      {"label":"Maturity Duration","value":"70-75 days from transplanting"},
      {"label":"Curd Colour","value":"Creamy white"},
      {"label":"Curd Weight","value":"700-900 g"},
      {"label":"Disease Tolerance","value":"Moderately tolerant to black rot"}
    ]},
    {"section":"open_pollinated","crop":"Coriander","name":"Multicut","slug":"coriander-multicut","regions":["South","Central","North","Pan India"],"attrs":[
      {"label":"Maturity Duration","value":"25-30 days for first cut"},
      {"label":"Leaf Colour","value":"Dark green"},
      {"label":"Remarks","value":"Suited to multiple successive harvests"}
    ]},
    {"section":"open_pollinated","crop":"Peas","name":"NZ-2009","slug":"peas-nz-2009","regions":["North","Central"],"attrs":[
      {"label":"Maturity Duration","value":"60-65 days from sowing"},
      {"label":"Pod Length","value":"7-9 cm"},
      {"label":"Pod Colour","value":"Dark green"},
      {"label":"Remarks","value":"Good pod filling, sweet flavour"}
    ]},
    {"section":"open_pollinated","crop":"Tomato","name":"S-22","slug":"tomato-s-22","regions":["South","Central"],"attrs":[
      {"label":"Maturity Duration","value":"70-75 days from transplanting"},
      {"label":"Fruit Weight","value":"60-80 g"},
      {"label":"Fruit Colour","value":"Red"},
      {"label":"Remarks","value":"Traditional open-pollinated type, seed-savable"}
    ]},
    {"section":"open_pollinated","crop":"Onion","name":"Litered","slug":"onion-litered","regions":["South","Central","North"],"attrs":[
      {"label":"Maturity Duration","value":"110-120 days from sowing"},
      {"label":"Bulb Colour","value":"Deep red"},
      {"label":"Bulb Shape","value":"Globe"},
      {"label":"Remarks","value":"Good storage life"}
    ]},
    {"section":"open_pollinated","crop":"Basil","name":"Green","slug":"basil-green","regions":["South","Pan India"],"attrs":[
      {"label":"Maturity Duration","value":"35-40 days for first harvest"},
      {"label":"Leaf Colour","value":"Bright green"},
      {"label":"Remarks","value":"Aromatic culinary type"}
    ]}
  ]';
begin
  for p in select * from jsonb_array_elements(products)
  loop
    insert into public.products (catalog_section, crop_type, name, slug, region_tags, hero_image_url, active, sort_order)
    values (
      p->>'section',
      p->>'crop',
      p->>'name',
      p->>'slug',
      (select coalesce(array_agg(x), '{}') from jsonb_array_elements_text(p->'regions') x),
      case when p->>'section' = 'hybrid' then '/images/crops/' || (p->>'slug') || '.jpg' else null end,
      true,
      0
    )
    returning id into new_id;

    for a in select * from jsonb_array_elements(p->'attrs')
    loop
      insert into public.product_attributes (product_id, label, value, sort_order)
      values (new_id, a->>'label', a->>'value', 0);
    end loop;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 2. Testimonials (consent = false: no consent record exists from the
--    original site, quotes are placeholder-quality pending ANZ review)
-- ---------------------------------------------------------------------
insert into public.testimonials (name, quote, consent) values
  ('Mohammed Adnan', 'I have been buying seeds from ANZ Agri for my farm and the quality has been consistently good. Their team was helpful in recommending the right variety for my land.', false),
  ('Swamy Chinna', 'Good customer service and guidance on sowing. I would recommend ANZ Agri to other farmers in my area.', false),
  ('Mirza Shoeb', 'ANZ Agri''s team gave me clear advice on which seeds would suit my region. The germination rate was good this season.', false);

-- ---------------------------------------------------------------------
-- 3. Site copy blocks
-- ---------------------------------------------------------------------
insert into public.site_copy (key, value) values
  ('hero_eyebrow', 'Trusted seeds since 2009'),
  ('hero_headline_line1', 'Grow more with seeds'),
  ('hero_headline_line2', 'built for your soil'),
  ('hero_subhead', 'ANZ Agri Crop Sciences breeds and supplies hybrid and open-pollinated vegetable seeds, backed by over a decade of plant genetics research and on-ground farmer support.'),
  ('cta_primary_label', 'Explore our seeds'),
  ('cta_secondary_label', 'Talk to an expert'),
  ('stat_1_label', '30+'),
  ('stat_1_caption', 'Seed varieties'),
  ('stat_2_label', '2009'),
  ('stat_2_caption', 'Founded'),
  ('stat_3_label', '10+ yrs'),
  ('stat_3_caption', 'R&D experience'),
  ('stat_4_label', 'Pan India'),
  ('stat_4_caption', 'Coverage'),
  ('cta_banner_headline', 'Ready to plan your next season?'),
  ('cta_banner_button_label', 'Get in touch'),
  ('about_who_we_are_body', 'ANZ Agri Crop Sciences was established in 2009 and is engaged in the agri seeds business, farming, and beekeeping. Our team brings over a decade of experience in plant genetics research and development, working closely with farmers to recommend the right seed for their region and crop plan.'),
  ('rebrand_story_body', 'The seed you know and trust now has a brand new look! Now when you see a logo on a product that looks like PGG Wrightson Seeds, that''s because it is.');

-- ---------------------------------------------------------------------
-- 4. Admin accounts
-- ---------------------------------------------------------------------
-- Admin *auth* users (email/password) cannot be portably created via plain
-- SQL against a hosted Supabase project (auth.users requires Supabase Auth's
-- own hashing/identity bookkeeping). Provision them with the Supabase CLI or
-- Dashboard, then link the resulting auth.users.id here, e.g.:
--
--   supabase auth admin create-user --email root@anzacs.in --password '<temp-pass>'
--
-- Then:
--   insert into public.admin_profiles (id, full_name, role)
--   values ('<uuid-from-above>', 'ANZ Root Admin', 'root_admin');
--
-- For local `supabase start` development, the Supabase CLI seed process
-- also supports creating an auth user directly; see docs/ARCHITECTURE.md
-- for the exact local dev command. No admin auth user is created by this
-- seed file to avoid embedding throwaway credentials in source control.
