## ToDo
* Fix ဈ vs စ+ျ in database
* Implement en => my key mapping to allow to type using os keyboard
* Implement search options (search pali contains, myanmar contains)
* Implement "Previous" & "Next" on paliStartsWith


## Initial Setup Notes

```
$ mkdir pali-dictionary
$ cd pali-dictionary
$ git init
$ vi .gitignore
$ virtualenv venv
$ source venv/bin/activate.fish
(venv) $ pip install flask
(venv) $ pip freeze > requirements.txt
```

## pali_dict.db Notes

sqlite db file from https://github.com/ninegene/uhsdictionary-data

Add new table and fix some data:
```sql
select distinct substr(pali, 1, 1) from PALI_MYANMAR_DICTIONARY;

-- there is invalid letter
select * from PALI_MYANMAR_DICTIONARY where pali LIKE '္%';
select * from PALI_MYANMAR_DICTIONARY where pali = '္မာရမ္မဏ';
-- change typo: '္မာရမ္မဏ' to 'ဓမ္မာရမ္မဏ'
select * from PALI_MYANMAR_DICTIONARY where pali = 'ဓမ္မာရမ္မဏ';

select count(*) from PALI_MYANMAR_DICTIONARY;

CREATE TABLE pali_myanmar AS
  SELECT pali, myanmar from pali_myanmar_dictionary;
CREATE INDEX "idx_pali_mm" ON "pali_myanmar" ("pali" ASC, "myanmar" ASC);
drop table pali_myanmar;

CREATE TABLE pali_mm AS
  SELECT pali, myanmar as mm from pali_myanmar_dictionary;
CREATE INDEX "idx_pali_mm" ON "pali_mm" ("pali" ASC, "mm" ASC);

select count(*) from pali_myanmar;

CREATE TABLE lookup_letter AS
  SELECT DISTINCT substr(pali, 1, 1) AS letter
  FROM pali_mm;

select * from lookup_letter;
```

```
က
ခ
ဂ
ဃ
င
စ
ဆ
ဇ
ဉ
ည
ဋ
ဌ
ဍ
ဎ
ဏ
တ
ထ
ဒ
ဓ
န
ပ
ဖ
ဗ
ဘ
မ
ယ
ရ
လ
ဝ
သ
ဟ
အ
ဣ
ဤ
ဥ
ဦ
ဧ
ဿ
```

Note: had to drop pali_dict.db and recreated it (export pali_mm table to cvs and
delete pali_dict.db and recreate new one by importing csv file)
because it has 170MB and excedded github file limit 100MB.


## mithril

* http://lhorie.github.io/mithril/mithril.html
* http://lhorie.github.io/mithril/mithril.component.html
* http://lhorie.github.io/mithril/components.html#application-architecture-with-components
* http://lhorie.github.io/mithril/mithril.prop.html
* http://lhorie.github.io/mithril/mithril.deferred.html
* http://lhorie.github.io/mithril/mithril.computation.html

Misc Notes:
http://stackoverflow.com/questions/8195741/how-do-they-do-this-mobile-site-added-to-homescreen-appears-as-standalone-app

Why m.props()?
* http://lhorie.github.io/mithril-blog/the-uniform-access-principle.html
* http://lhorie.github.io/mithril-blog/json-all-the-things.html


