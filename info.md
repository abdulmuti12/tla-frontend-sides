info project
untul backend ini projectnya htdoc/tla-main
untuk fronent projecnya di htdoc/tla-fe

list task

1.perbaiki di halaman fe __admin?tab=promotion ketika klik edit gambanya tidak muncul dan
di halamanpromotion/id_project gambarnya tidak muncul,jangan rubah desin ketika ada update


2. di __admin?tab=press-release

pada saat create muncul error 

TypeError: Cannot read properties of undefined (reading 'toISOString')

Source
src/components/AdminPage/AdminPage.tsx (1922:29) @ toISOString

  1920 |     const payload = {
  1921 |       ...formValues,
> 1922 |       date: formValues.date.toISOString(),
       |                             ^
  1923 |     };
  1924 |
  1925 |     let response;



Update press release failed: Incorrect date value: '2023-11-29T17:00:00.000Z' for column `tla`.`press_releases`.`date` at row 1

perbaiki ini

dan di updatenya __admin?tab=press-release

muncul Update press release failed: Incorrect date value: '2025-10-30T17:00:00.000Z' for column `tla`.`press_releases`.`date` at row 1

pebaiki errornya

3.kerika buka halaman
/press/id pebaiki gambar yang tidak muncul


4.perbaiki
halaman 

__admin?tab=project

ketika create muncul error

Create project failed: Incorrect date value: '1784566800000' for column `tla`.`projects`.`date` at row 1

dam ketika update mucul error 
Update project failed: Incorrect date value: '1667322000000' for column `tla`.`projects`.`date` at row 1

Create project failed: Cannot read properties of undefined (reading 'length')

perbaiki
halaman 

promotion/id
gambarnya tidak muncul

info project
untul backend ini projectnya htdoc/tla-main
untuk fronent projecnya di htdoc/tla-fe

