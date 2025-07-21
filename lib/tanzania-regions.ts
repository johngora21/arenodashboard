export interface District {
  name: string;
}

export interface Region {
  name: string;
  districts: District[];
}

export const tanzaniaRegions: Region[] = [
  {
    name: "Arusha",
    districts: [
      { name: "Arusha City" },
      { name: "Arusha Rural" },
      { name: "Karatu" },
      { name: "Longido" },
      { name: "Meru" },
      { name: "Monduli" },
      { name: "Ngorongoro" }
    ]
  },
  {
    name: "Dar es Salaam",
    districts: [
      { name: "Ilala" },
      { name: "Kigamboni" },
      { name: "Kinondoni" },
      { name: "Temeke" },
      { name: "Ubungo" }
    ]
  },
  {
    name: "Dodoma",
    districts: [
      { name: "Bahi" },
      { name: "Chamwino" },
      { name: "Chemba" },
      { name: "Dodoma City" },
      { name: "Kondoa Rural" },
      { name: "Kondoa Town" },
      { name: "Kongwa" },
      { name: "Mpwapwa" }
    ]
  },
  {
    name: "Geita",
    districts: [
      { name: "Bukombe" },
      { name: "Chato" },
      { name: "Geita Rural" },
      { name: "Geita Town" },
      { name: "Mbogwe" },
      { name: "Nyang'hwale" }
    ]
  },
  {
    name: "Iringa",
    districts: [
      { name: "Iringa Municipal" },
      { name: "Iringa Rural" },
      { name: "Kilolo" },
      { name: "Mafinga Town" },
      { name: "Mufindi" }
    ]
  },
  {
    name: "Kagera",
    districts: [
      { name: "Biharamulo" },
      { name: "Bukoba Municipal" },
      { name: "Bukoba Rural" },
      { name: "Karagwe" },
      { name: "Kyerwa" },
      { name: "Missenyi" },
      { name: "Muleba" },
      { name: "Ngara" }
    ]
  },
  {
    name: "Katavi",
    districts: [
      { name: "Mlele" },
      { name: "Mpanda Municipal" },
      { name: "Mpimbwe" },
      { name: "Nsimbo" },
      { name: "Tanganyika" }
    ]
  },
  {
    name: "Kigoma",
    districts: [
      { name: "Buhigwe" },
      { name: "Kakonko" },
      { name: "Kasulu Rural" },
      { name: "Kasulu Town" },
      { name: "Kibondo" },
      { name: "Kigoma Municipal" },
      { name: "Kigoma Rural" },
      { name: "Uvinza" }
    ]
  },
  {
    name: "Kilimanjaro",
    districts: [
      { name: "Hai" },
      { name: "Moshi Municipal" },
      { name: "Moshi Rural" },
      { name: "Mwanga" },
      { name: "Rombo" },
      { name: "Same" },
      { name: "Siha" }
    ]
  },
  {
    name: "Lindi",
    districts: [
      { name: "Kilwa" },
      { name: "Lindi Municipal" },
      { name: "Liwale" },
      { name: "Mtama" },
      { name: "Nachingwea" },
      { name: "Ruangwa" }
    ]
  },
  {
    name: "Manyara",
    districts: [
      { name: "Babati Rural" },
      { name: "Babati Town" },
      { name: "Hanang" },
      { name: "Kiteto" },
      { name: "Mbulu Rural" },
      { name: "Mbulu Town" },
      { name: "Simanjiro" }
    ]
  },
  {
    name: "Mara",
    districts: [
      { name: "Bunda Rural" },
      { name: "Bunda Town" },
      { name: "Butiama" },
      { name: "Musoma Municipal" },
      { name: "Musoma Rural" },
      { name: "Rorya" },
      { name: "Serengeti" },
      { name: "Tarime Rural" },
      { name: "Tarime Town" }
    ]
  },
  {
    name: "Mbeya",
    districts: [
      { name: "Busekelo" },
      { name: "Chunya" },
      { name: "Kyela" },
      { name: "Mbarali" },
      { name: "Mbeya City" },
      { name: "Mbeya Rural" },
      { name: "Rungwe" }
    ]
  },
  {
    name: "Morogoro",
    districts: [
      { name: "Gairo" },
      { name: "Ifakara Town" },
      { name: "Kilosa" },
      { name: "Malinyi" },
      { name: "Mlimba" },
      { name: "Morogoro Municipal" },
      { name: "Morogoro Rural" },
      { name: "Mvomero" },
      { name: "Ulanga" }
    ]
  },
  {
    name: "Mtwara",
    districts: [
      { name: "Masasi Rural" },
      { name: "Masasi Town" },
      { name: "Mtwara Municipal" },
      { name: "Mtwara Rural" },
      { name: "Nanyamba Town" },
      { name: "Nanyumbu" },
      { name: "Newala Rural" },
      { name: "Newala Town" },
      { name: "Tandahimba" }
    ]
  },
  {
    name: "Mwanza",
    districts: [
      { name: "Buchosa" },
      { name: "Ilemela Municipal" },
      { name: "Kwimba" },
      { name: "Magu" },
      { name: "Misungwi" },
      { name: "Mwanza City" },
      { name: "Sengerema" },
      { name: "Ukerewe" }
    ]
  },
  {
    name: "Njombe",
    districts: [
      { name: "Ludewa" },
      { name: "Makambako Town" },
      { name: "Makete" },
      { name: "Njombe Rural" },
      { name: "Njombe Town" },
      { name: "Wanging'ombe" }
    ]
  },
  {
    name: "Pwani",
    districts: [
      { name: "Bagamoyo" },
      { name: "Chalinze" },
      { name: "Kibaha" },
      { name: "Kibaha Town" },
      { name: "Kibiti" },
      { name: "Kisarawe" },
      { name: "Mafia" },
      { name: "Mkuranga" },
      { name: "Rufiji" }
    ]
  },
  {
    name: "Rukwa",
    districts: [
      { name: "Kalambo" },
      { name: "Nkasi" },
      { name: "Sumbawanga Municipal" },
      { name: "Sumbawanga Rural" }
    ]
  },
  {
    name: "Ruvuma",
    districts: [
      { name: "Madaba" },
      { name: "Mbinga Rural" },
      { name: "Mbinga Town" },
      { name: "Namtumbo" },
      { name: "Nyasa" },
      { name: "Songea Municipal" },
      { name: "Songea Rural" },
      { name: "Tunduru" }
    ]
  },
  {
    name: "Shinyanga",
    districts: [
      { name: "Kahama Municipality" },
      { name: "Kishapu" },
      { name: "Msalala" },
      { name: "Shinyanga Municipal" },
      { name: "Shinyanga Rural" },
      { name: "Ushetu" }
    ]
  },
  {
    name: "Simiyu",
    districts: [
      { name: "Bariadi Rural" },
      { name: "Bariadi Town" },
      { name: "Busega" },
      { name: "Itilima" },
      { name: "Maswa" },
      { name: "Meatu" }
    ]
  },
  {
    name: "Singida",
    districts: [
      { name: "Ikungi" },
      { name: "Iramba" },
      { name: "Itigi" },
      { name: "Manyoni" },
      { name: "Mkalama" },
      { name: "Singida Municipal" },
      { name: "Singida Rural" }
    ]
  },
  {
    name: "Songwe",
    districts: [
      { name: "Ileje" },
      { name: "Mbozi" },
      { name: "Momba" },
      { name: "Songwe" },
      { name: "Tunduma Town" }
    ]
  },
  {
    name: "Tabora",
    districts: [
      { name: "Igunga" },
      { name: "Kaliua" },
      { name: "Nzega Rural" },
      { name: "Nzega Town" },
      { name: "Sikonge" },
      { name: "Tabora Municipal" },
      { name: "Urambo" },
      { name: "Uyui" }
    ]
  },
  {
    name: "Tanga",
    districts: [
      { name: "Bumbuli" },
      { name: "Handeni Rural" },
      { name: "Handeni Town" },
      { name: "Kilindi" },
      { name: "Korogwe Rural" },
      { name: "Korogwe Town" },
      { name: "Lushoto" },
      { name: "Mkinga" },
      { name: "Muheza" },
      { name: "Pangani" },
      { name: "Tanga City" }
    ]
  },
  {
    name: "Zanzibar Central/South",
    districts: [
      { name: "Kati" },
      { name: "Kusini" }
    ]
  },
  {
    name: "Zanzibar North",
    districts: [
      { name: "Kaskazini A" },
      { name: "Kaskazini B" }
    ]
  },
  {
    name: "Zanzibar Urban/West",
    districts: [
      { name: "Magharibi A" },
      { name: "Magharibi B" },
      { name: "Mjini" }
    ]
  }
]; 