Program Vier_Gewinnt (Dat1,Datja);

Uses Graph, Crt;                                 {Grafik- und Normalmodus}

Label   Neustart;

Var     GraphDriver, GraphMode,                  {Grafikauswahl}
        Code,                                    {Stringumwandlung}
        I,J,K                                    {Schleifendummy's}
                                                 :Integer;

        Spalte, Zeile,
        Zahl, Nr,                                {Eingabe (Int)}
        GewSSt, GewZSt, Richtung,                {Gewinnzeilen, -Spalten}
        Last_1, Last_2                           {Letzte 2 ZÅge}
                                                 :Byte;

        Abfrage,                                 {allgemeine Eingabe}
        Farbe,
        Farbe_Sp,                                {Farbe des Gegners}
        Farbe_Co,                                {Farbe des Computers}
        Prior_1, Prior_2                         {Steuerung Computerzug}
                                                 :String[10];

        Zeichen                                  {Hilfsgrî·e}
                                                 :String[1];

        Bst                                      {Hilfsgrî·e}
                                                 :Char;

        Beginner,                                {true: Spieler beginnt}
        Spielende                                {true: Spielende}
                                                 :boolean;

        Waag,  Senk,  Liob,  Reob                :Array [0..9] of String[8];

        Suchstring                               :Array [1..19] of String[5];

        Platz                                    :Array [1..8,0..8] of Char;

        Zug                                      :Array [1..64] of Byte;

        Gewinner                                 :(Spieler,Computer,
                                                  Niemand,Unentschieden);

        dat1, datja                              :text;


{------------------     UNTERPROGRAMME     --------------------------------}

{--------------------------------------------------------------------------}
{------------------     Einstellungen initialisieren     ------------------}
{--------------------------------------------------------------------------}

Procedure Init;

Begin
For Spalte:=1 to 8 do
    Begin
    Platz[Spalte,0]:='o';
    For Zeile:=1 to 8 do
        Platz[Spalte,Zeile]:='O';
    End;
For I:=1 to 64 do
    Zug[I]:=0;
For I:=1 to 8 do
    Begin
    Waag[I]:='OOOOOOOO';
    Senk[I]:='OOOOOOOO';
    End;
For I:=1 to 9 do
    Begin
    Reob[I]:='';
    Liob[I]:='';
    For J:=1 to (8-abs(5-I)) do
        Begin
        Reob[I]:=Reob[I]+'O';
        Liob[I]:=Liob[I]+'O';
        End; {For-J-Begin}
    End;     {For-I-Begin}
Suchstring[1]:='CCCC';
Suchstring[2]:='SSSS';
Suchstring[3]:='OOSSO';
Suchstring[4]:='OSSOO';
Suchstring[5]:='OOCCO';
Suchstring[6]:='OCCOO';
Suchstring[7]:='CCOO';
Suchstring[8]:='COCO';
Suchstring[9]:='COOC';
Suchstring[10]:='OCCO';
Suchstring[11]:='OCOC';
Suchstring[12]:='OOCC';
Suchstring[13]:='COOO';
Suchstring[14]:='OCOO';
Suchstring[15]:='OOCO';
Suchstring[16]:='OOOC';
Suchstring[17]:='OOCOO';
Suchstring[18]:='SOSOS';
Suchstring[19]:='OSOSO';
Nr:=0;
Spalte:=0;
Zeile:=0;
Last_1:=0;
Last_2:=0;
Gewinner:=Niemand;
Spielende:=false;
GewZSt:=0;
GewSSt:=0;
End; {Procedure Init}

{--------------------------------------------------------------------------}
{------------------     Graphik initialisieren     ------------------------}
{--------------------------------------------------------------------------}

Procedure Grafik;

Begin
GraphDriver:=Detect;
{-- valerie: InitGraph (GraphDriver,GraphMode,'C:\SOFTWARE\TP\BGI'); }
InitGraph (GraphDriver,GraphMode,'./bgi'); 
End; {Procedure Grafik}

{--------------------------------------------------------------------------}
{------------------     Grafik-Umrechnung     -----------------------------}
{--------------------------------------------------------------------------}

Function X (X_Koord: Integer): Integer;

Begin
X:= Round(GetMaxX/639*X_Koord);
End;


Function Y (Y_Koord: Integer): Integer;

Begin
Y:= Round(GetMaxY/480*Y_Koord);
End;

{--------------------------------------------------------------------------}
{------------------     Titelbild     -------------------------------------}
{--------------------------------------------------------------------------}

Procedure Titel;

Begin
SetViewPort (0,0,X(639),Y(479),true);
ClearViewPort;
SetTextStyle (TriplexFont,0,10);
SetTextJustify (0,0);
SetBkColor (White);
SetColor (Blue);
SetFillStyle (EmptyFill,White);
OutTextXY (5,Y(120),'4 Gewinnt');
Delay (200);
SetTextStyle (1,0,1);
Bar3D (X(145),Y(200)+2*TextHeight('I'),X(490),Y(200)-TextHeight('I')-3,
      8,true);
OutTextXY (X(150),Y(200),'Studienarbeit von DIETER HEININGER');
OutTextXY (X(150),Y(200)+TextHeight('I')+3,
          '    im Semester MF 4  (SS 1990)');
OutTextXY (X(80),Y(360),'Dieses Programm soll die enorme LeistungsfÑhigkeit');
OutTextXY (X(80),Y(360)+TextHeight('I')+3,
          '    von Computern (und MF-Studenten) beweisen.');
Readln;              {Weiter gehts}
End; {Procedure titel}

{--------------------------------------------------------------------------}
{------------------     Spielregeln     -----------------------------------}
{--------------------------------------------------------------------------}

Procedure Spielregeln;

Begin
RestoreCrtMode;
Writeln;
TextColor(LightGreen);
Write('Benîtigen Sie die Spielregeln (j/');
TextColor(LightCyan+Blink);
Write('n');
TextColor(LightGreen);
Writeln(')?');
Readln(Abfrage);
If (Abfrage<>'j') and (Abfrage<>'J') then
    Exit
Else
    Begin
    TextColor(LightCyan);
    Writeln;
    Writeln('Das Spielfeld besteht aus einer senkrecht stehenden 8x8-Feld-Matrix.');
    Writeln('Wenn man eine Spalte mit einem Spielstein wÑhlen will, so fÑllt');
    Writeln('dieser bis auf den tiefsten freien Platz dieser Spalte.');
    Writeln('Ziel des Spiels ist es, 4 Spielsteine auf benachbarte PlÑtze');
    Writeln('zu bringen, wobei es gleichgÅltig ist, ob die Steine waagrecht,');
    Writeln('senkrecht oder diagonal auf dem Brett liegen.');
    Writeln;
    TextColor(LightGreen+Blink);
    Write('<RETURN> ');
    TextColor(LightGreen);
    Writeln('drÅcken!');
    Readln;
    End; {Else-Begin}

End; {Procedure Spielregeln}

{--------------------------------------------------------------------------}
{------------------     Anfangseinstellungen     --------------------------}
{--------------------------------------------------------------------------}

Procedure Anfang;

Begin

{------------------     Wahl der Spielfarbe     --------------------------}

Repeat
    Writeln;
    Write('WÑhlen Sie Ihre Spielfarbe (');
    TextColor(LightCyan+Blink);
    Write('rot');
    TextColor(LightGreen);
    Writeln('/wei·)');
    Readln(abfrage);
Until (Abfrage='wei·') or (Abfrage='rot') or (Abfrage='');
If (Abfrage='wei·') then
Begin
    Farbe_Sp:='white';
    Farbe_Co:='red'
End
Else
Begin
    Farbe_Sp:='red';
    Farbe_Co:='white';
End;

{------------------     Wahl des Spielanfangs     --------------------------}

Writeln;
Write('Wollen Sie anfangen ');
TextColor(LightCyan+Blink);
Write('( --> j )');
TextColor(LightGreen);
Writeln(' oder soll der Computer beginnen ( --> n )?');
Readln(Abfrage);
If (Abfrage='j') or (Abfrage='J') or (Abfrage='') then
    Beginner:=true
Else
    Beginner:=false;


End; {Procedure Anfang}

{--------------------------------------------------------------------------}
{------------------     Spielfeld zeichnen     ----------------------------}
{--------------------------------------------------------------------------}

Procedure Spielfeld;

Begin
SetViewPort (0,0,X(639),Y(336)+3*TextHeight('I'),true);
ClearViewPort;
SetTextStyle (TriplexFont,0,1);
SetTextJustify (1,0);
SetBkColor (LightGray);
SetColor (Blue);
For Spalte := 1 to 8 do
    Begin
    Str(Spalte,Zeichen);
    OutTextXY (X(130+Spalte*42),Y(336)+TextHeight('I'),Zeichen);
    For Zeile := 1 to 8 do
        Rectangle (X(110+Spalte*42),Y(Zeile*42-40),
        X(150+Spalte*42),Y(Zeile*42));
    End; {For-Spalte-Begin}
Line (0,Y(336)+TextHeight('I')+3,X(639),Y(336)+TextHeight('I')+3);
End; {Procedure Spielfeld}

{--------------------------------------------------------------------------}
{------------------     Textzeile      ------------------------------------}
{--------------------------------------------------------------------------}

Procedure Textzeile(Zahl:Byte);

Begin
SetViewPort (0,Y(479)-TextHeight('Ip')-5,X(639),Y(479),true);
ClearViewPort;
Line (0,0,X(639),0);
SetTextJustify (0,0);
SetColor (Blue);
Case Zahl of
    1: OutTextXY (X(10),TextHeight('Ip')+2,
       '1 . . 8 :  Spalten  wÑhlen ,      A : Abbrechen');
    2: OutTextXY (X(10),TextHeight('Ip')+2,
       'S :  Spiel  speichern ,        L :  Spiel  laden,        E: Programmende');
    3: OutTextXY (X(10),TextHeight('Ip')+2,
       '<RETURN> :  Weiterspielen ,     "E" + <RETURN> :  Spielende');
End; {Case}
End; {Procedure Textzeile}

{--------------------------------------------------------------------------}
{------------------     Kontrolle zum Zeilensetzen     --------------------}
{--------------------------------------------------------------------------}

Function Kontrolle: Boolean;

Begin
Zeile:=0;
Repeat
    Inc (Zeile);
Until (Platz[Spalte,Zeile]='O');
If (Zeile>8) then
    Kontrolle:=false
else
    Kontrolle:=true;
End; {Function Kontrolle}

{--------------------------------------------------------------------------}
{------------------     Spieler setzt     ---------------------------------}
{--------------------------------------------------------------------------}

Procedure Wahl;
Var I: Integer;

Begin
SetViewPort (0,Y(390),X(639),Y(450),true);
ClearViewPort;
SetColor (Blue);
OutTextXY (X(10),TextHeight('Ip'),'Welche Spalte mîchten Sie setzen?');
Repeat
    Bst:=ReadKey;
    Val (Bst,Spalte,Code);
Until ((Spalte>0) and (Spalte<9) and (Code=0) and (Kontrolle))
or (Bst='a') or (Bst='A');
OutTextXY (X(330),TextHeight('Ip'),Bst);
If (Bst='a') or (Bst='A') then
    Begin
    Spielende:=true;
    Gewinner:=Niemand;
    Exit;
    End;  {If-(Bst..)-Begin}
End;      {Procedure Wahl}

{--------------------------------------------------------------------------}
{------------------     Zeichnen, Speichern     ---------------------------}
{--------------------------------------------------------------------------}

Procedure Zeichnen (Wert:Char; Col:String);
Var I: ShortInt;

Begin
SetViewPort (0,0,X(639),Y(353),true);
For I:=0 to 3 do
    Begin
    If Odd(I) then
        If (Col='red') then
            Begin
            SetFillStyle (SolidFill,Red);
            SetColor (Red);
            End
        Else
            Begin
            SetFillStyle (SolidFill,White);
            SetColor(White);
            End
    Else
        Begin
        SetColor (LightGray);
        SetFillStyle (Solidfill,LightGray);
        End;
    FillEllipse (X(130+Spalte*42),Y(358-Zeile*42),X(18),Y(18));
    Delay(300);
    End;
Platz[Spalte,Zeile]:=Wert;
Inc (Nr);
Zug[Nr]:=Spalte;
Last_2:=Last_1;
Last_1:=Spalte;
If Nr=64 then
    Spielende:=true;
End; {Procedure Zeichnen}

{--------------------------------------------------------------------------}
{------------------     Markierung des Siegervierers     ------------------}
{--------------------------------------------------------------------------}

Procedure Markierung(Col:String);
Var I: Integer;

Begin
SetViewPort (0,0,X(639),Y(353),true);
For I:=0 to 7 do
    Begin
    If Odd(I) then
        If (Col='red') then
            Begin
            SetColor (Red);
            SetFillStyle (SolidFill,Red);
            End
        Else
            Begin
            SetColor (White);
            SetFillStyle (Solidfill,White);
            End
    Else
        Begin
        SetColor (LightGray);
        SetFillStyle (Solidfill,LightGray);
        End;
    Case Richtung of
    1: Begin
       FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       FillEllipse (X(88+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));
       FillEllipse (X(46+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));
       FillEllipse (X(4+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));
       End;
    2: Begin
       FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       FillEllipse (X(130+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));
       FillEllipse (X(130+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));
       FillEllipse (X(130+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));
       End;
    3: Begin
       FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       FillEllipse (X(172+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));
       FillEllipse (X(214+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));
       FillEllipse (X(256+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));
       End;
    4: Begin
       FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       FillEllipse (X(172+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       FillEllipse (X(214+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       FillEllipse (X(256+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
       End;
    End;  {Case}
    Delay (400);
    End;  {For-I-Begin}

End; {Procedure Markierung}

{--------------------------------------------------------------------------}
{------------------     Aktualisierung der Strings     --------------------}
{--------------------------------------------------------------------------}

Procedure AktString (Wert: Char);
Var    Num, Stelle:  ShortInt;

Begin
Waag[Zeile,Spalte]:=Wert;
Senk[Spalte,Zeile]:=Wert;
Num:=Spalte-Zeile+5;                          {--------------}
If (Num>0) and (Num<10) then
    Begin
    If (Num<6) then
        Stelle:=Zeile+Num-5                   {---  REOB  ---}
    Else
        Stelle:=Zeile;
    Reob[Num,Stelle]:=Wert;
    End; {If-Begin}                           {--------------}
Num:=-(Spalte+Zeile)+14;                      {--------------}
If (Num>0) and (Num<10) then
    Begin
    If (Num<6) then
        Stelle:=Zeile+Num-5                   {---  LIOB  ---}
    Else
        Stelle:=Zeile;
    Liob[Num,Stelle]:=Wert;
    End; {If-Begin}                           {--------------}
End; {Procedure AktString}

{--------------------------------------------------------------------------}
{------------------     Gewinnsuche     -----------------------------------}
{--------------------------------------------------------------------------}

Procedure Gewinnsuche(Wert:String);
Var    Num, Stelle:  ShortInt;

Begin
{----------------------------------     Waagrecht suchen     --------------}
Stelle:=Pos (Wert,Waag[Zeile]);
If (Stelle<>0) then
    Begin
    GewZSt:=Zeile;
    GewSSt:=Stelle;
    Richtung:=4;
    Spielende:=true;
    End; {If-Begin}
{----------------------------------     Senkrecht suchen     --------------}
Stelle:=Pos (Wert,Senk[Spalte]);
If (Stelle<>0) then
    Begin
    GewZSt:=Stelle;
    GewSSt:=Spalte;
    Richtung:=2;
    Spielende:=true;
    End; {If-Begin}
{------------------------------     SchrÑg nach rechts oben suchen     ----}
Num:=Spalte-Zeile+5;
If (Num>0) and (Num<10) then
    Begin
    Stelle:=Pos (Wert,Reob[Num]);
    If (Stelle<>0) then
        Begin
        If (Num<6) then
            GewZSt:=Stelle-Num+5
        Else
            GewZSt:=Stelle;
        If (Num<6) then
            GewSSt:=Stelle
        Else
            GewSSt:=Stelle+Num-5;
        Richtung:=3;
        Spielende:=true;
        End; {If-Begin}
    End;     {If-Begin}
{------------------------------     SchrÑg nach links oben suchen     -----}
Num:=-(Spalte+Zeile)+14;
If (Num>0) and (Num<10) then
    Begin
    Stelle:=Pos (Wert,Liob[Num]);
    If (Stelle<>0) then
        Begin
        If (Num<6) then
            GewZSt:=Stelle-Num+5
        Else
            GewZSt:=Stelle;
        If (Num<6) then
            GewSSt:=9-Stelle
        Else
            GewSSt:=14-Stelle-Num;
        Richtung:=1;
        Spielende:=true;
        End; {If-Begin}
    End;     {If-Begin}
If (Wert='SSSS') and (Spielende) then
    Begin
    Gewinner:=Spieler;
    Farbe:=Farbe_Sp;
    End;
If (Wert='CCCC') and (Spielende) then
    Begin
    Gewinner:=Computer;
    Farbe:=Farbe_Co;
    End;
End; {Procedure Gewinnsuche}

{--------------------------------------------------------------------------}
{------------------     Stringsuche mit PrioritÑtsprÅfung     -------------}
{--------------------------------------------------------------------------}

{------------------     Hilfsfunktion     ---------------------------------}

Function Dummy_1 (Wert, Pr: String):String;
Var J: Integer;

Begin
If (Platz[Spalte,Zeile-1]<>'O') then
    Begin
    Str (Spalte:1,Zeichen);
    For J:=1 to Length (Pr) do
        If (Pr[J]=Zeichen) then
            Zeichen:='';
    Insert (Zeichen,Pr,1);
    End; {If-(Platz..)-Begin}
Dummy_1:=Pr;
End; {Function Dummy_1}

{------------------     Hilfsprozedur (Rechts Oben)     -------------------}

Procedure Dummy_Reob (Stelle, Num: ShortInt);

Begin
If (Num<6) then
    Begin
    Zeile:=Stelle-Num+5;
    Spalte:=Stelle;
    End
Else
    Begin
    Zeile:=Stelle;
    Spalte:=Stelle+Num-5;
    End;
End; {Procedure Dummy_Reob}

{------------------     Hilfsprozedur (Links Oben)     --------------------}

Procedure Dummy_Liob (Stelle, Num: ShortInt);

Begin
If (Num<6) then
    Begin
    Zeile:=Stelle-Num+5;
    Spalte:=9-Stelle;
    End
Else
    Begin
    Zeile:=Stelle;
    Spalte:=14-Stelle-Num;
    End;
End; {Procedure Dummy_Liob}

{--------------------------------------------------------------------------}

Function Prior (Wert, Pri: String; Zahl: Byte; Setzen: Boolean): String;
Var    Num, Stelle:  ShortInt;
       I, J:         Integer;
       Stop:         Boolean;

Begin
Stop:=false;

{--------------------     SchrÑg nach rechts oben suchen/PrioritÑt     ----}
For Num:=1 to 9 do
    Begin
    Stelle:=Pos (Wert,Reob[Num]);
    If (Stelle<>0) then
        Begin
        If (Setzen) then
            For J:=0 to (Length (Wert)-1) do
                Begin
                Dummy_Reob (Stelle+J, Num);
                If (Platz[Spalte,Zeile]='O')
                and (Platz[Spalte,Zeile-1]='O') then
                    Stop:=true;
                End;  {For-J-Begin}
        If not (Stop) then
            If (Zahl<>0) then
                Begin
                Dummy_Reob (Stelle+Zahl-1, Num);
                Pri:=Dummy_1 (Wert, Pri);
                End
            Else
                Begin
                For I:=0 to ((Length(Wert))-1) do
                    If (Wert[I+1]='O') then
                        Begin
                        Dummy_Reob (Stelle+I, Num);
                        Pri:=Dummy_1 (Wert, Pri);
                        End  {If-(Wert..)-Begin}
                End;     {Else-Begin}
        End;             {If-(Stelle..)-Begin}
    End;                 {For-Num-Begin}

{--------------------     SchrÑg nach links oben suchen/PrioritÑt     -----}
Stop:=false;
For Num:=1 to 9 do
    Begin
    Stelle:=Pos (Wert,Liob[Num]);
    If (Stelle<>0) then
        Begin
        If (Setzen) then
            For J:=0 to (Length (Wert)-1) do
                Begin
                Dummy_Liob (Stelle+J, Num);
                If (Platz[Spalte,Zeile]='O')
                and (Platz[Spalte,Zeile-1]='O') then
                    Stop:=true;
                End;  {For-J-Begin}
        If not (Stop) then
            If (Zahl<>0) then
                Begin
                Dummy_Liob (Stelle+Zahl-1, Num);
                Pri:=Dummy_1 (Wert, Pri);
                End
            Else
                Begin
                For I:=0 to ((Length(Wert))-1) do
                    If (Wert[I+1]='O') then
                        Begin
                        Dummy_Liob (Stelle+I, Num);
                        Pri:=Dummy_1 (Wert, Pri);
                        End;  {If-(Wert..)-Begin}
                End;          {Else-Begin}
        End;                  {If-(Stelle..)-Begin}
    End;                      {For-Num-Begin}

{----------------------------------     Waagrecht suchen/PrioritÑt     ----}
Stop:=false;
For Zeile:=1 to 8 do
    Begin
    Stelle:=Pos (Wert,Waag[Zeile]);
    If (Stelle<>0) then
        Begin
        If (Setzen) then
            For J:=0 to (Length (Wert)-1) do
                If (Platz[Stelle+J,Zeile]='O')
                and (Platz[Stelle+J,Zeile-1]='O') then
                    Stop:=true;
        If not (Stop) then
            If (Zahl<>0) then
                Begin
                Spalte:=Stelle+Zahl-1;
                Pri:=Dummy_1 (Wert,Pri);
                End
            Else
                For I:=0 to ((Length(Wert))-1) do
                    If Wert[I]='O' then
                        Begin
                        Spalte:=Stelle+I-1;
                        Pri:=Dummy_1 (Wert,Pri);
                        End;
        End; {If-(Stelle..)-Begin}
    End;     {For-Zeile-Begin}

{----------------------------------     Senkrecht suchen/PrioritÑt     ----}
Stop:=false;
For Spalte:=1 to 8 do
    Begin
    Stelle:=Pos (Wert,Senk[Spalte]);
    If (Stelle<>0) then
        Begin
        If Kontrolle then
            Pri:=Dummy_1 (Wert,Pri);
        End;
    End;     {For-Spalte-Begin}
Prior:=Pri;
End;                      {Function Prior}


{--------------------------------------------------------------------------}
{------------------     Warnung vor gefÑhrlichen ZÅgen     ----------------}
{--------------------------------------------------------------------------}

Function Warnung: Boolean;

Begin
Warnung:=false;
If Kontrolle then
If (Zeile<8) then
    Begin
    Inc (Zeile);
    AktString('S');
    Gewinnsuche('SSSS');
    If Spielende then
        Begin
        Spielende:=false;
        Gewinner:=Niemand;
        Warnung:=true;
        End; {If-Spielende-Begin}
    AktString('O');
    End; {If-(Zeile..)-Begin}
End;     {Function Warnung}

{--------------------------------------------------------------------------}
{------------------     Zugauswertung                    ------------------}
{--------------------------------------------------------------------------}

Function Zugauswertung: Boolean;
Var I,J: Integer;

Begin
Zugauswertung:=false;
For I:=1 to (Length (Prior_1)-1) do
    Begin
    Val (Prior_1[I],Spalte,Code);
    For J:=(Length (Prior_2)-1) downto 1 do
        If (Prior_2[J]=Prior_1[I]) and not (Warnung) then
            If Kontrolle then
                Begin
                Zeichnen ('C',Farbe_Co);
                AktString('C');
                Zugauswertung:=true;
                Exit;
                End;  {If-Kontrolle-Begin}
    End;              {For-I-Begin}
End;                  {Function Zugauswertung}

{--------------------------------------------------------------------------}
{------------------     Spielerzug     ------------------------------------}
{--------------------------------------------------------------------------}

Procedure Spieler_Zug;

Begin
If Spielende then
    Exit;
Wahl;                                {Spieler setzt}
If Not Spielende then
    Begin
    Zeichnen('S',Farbe_Sp);          {Spielstein zeichnen + Zug speichern}
    AktString('S');                  {Aktualisieren der Spielfeld-Strings}
    Gewinnsuche('SSSS');             {Kontrolle auf Spielergewinn}
    End
Else
    Exit;
If Gewinner=Spieler then
    Begin
    Spielende:=true;
    Markierung(Farbe_Sp);
    End;
Delay(500);
End; {Procedure Spieler_Zug}

{--------------------------------------------------------------------------}
{------------------     Computerzug     -----------------------------------}
{--------------------------------------------------------------------------}

Procedure Computer_Zug;

Begin
If Spielende then
    Exit;
SetViewPort (0,Y(390),X(639),Y(450),true);
ClearViewPort;
SetColor (Blue);
OutTextXY (X(10),TextHeight('Ip'),'Bitte etwas Geduld, ich mu· nachdenken  ! ! !');

{------------------     Auf Gewinn prÅfen     -----------------------------}

For Spalte:=1 to 8 do
    Begin
    If Kontrolle then                      {8 ZÅge setzen}
        Begin
        AktString('C');
        Gewinnsuche('CCCC');
        If Spielende then                  {evtl. Gewinn}
            Begin
            Zeichnen('C',Farbe_Co);
            Markierung(Farbe_Co);
            Exit;                          {Verlassen von Computer-Zug}
            End  {If-Spielende-Begin}
        Else
            AktString('O');                {Zug wieder lîschen}
        End;  {If-Kontrolle-Begin}
    End;      {For-Spalte-Begin}

{------------------     Direkt-Gewinn-Verhinderung Gegner     -------------}

For Spalte:=1 to 8 do
    Begin
    If Kontrolle then                      {8 ZÅge setzen}
        Begin
        AktString('S');
        Gewinnsuche('SSSS');
        If Spielende then                  {evtl. 'Feind'-gewinn}
            Begin
            AktString('C');
            Spielende:=false;
            Gewinner:=Niemand;
            Zeichnen('C',Farbe_Co);
            Exit;                          {Verlassen von Computer-Zug}
            End  {If-Spielende-Begin}
        Else
            AktString('O');                {Zug wieder lîschen}
        End;  {If-Kontrolle-Begin}
    End;      {For-Spalte-Begin}

{------------------     Suchen des besten Zuges     -----------------------}

Prior_1:=Prior (Suchstring[3],' ',0,true);
Prior_1:=Prior (Suchstring[4],Prior_1,0,true);
Prior_1:=Prior (Suchstring[18],Prior_1,0,true);
Prior_1:=Prior (Suchstring[19],Prior_1,0,true);
Prior_2:=Prior (Suchstring[5],' ',2,true);
Prior_2:=Prior (Suchstring[6],Prior_2,4,true);
Prior_2:=Prior (Suchstring[17],Prior_2,2,true);
Prior_2:=Prior (Suchstring[17],Prior_2,4,true);
If (Zugauswertung) then
    Exit;

Prior_2:=' ';
For K:=7 to 12 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
For K:=7 to 12 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
If (Zugauswertung) then
    Exit;

For K:=13 to 16 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
For K:=13 to 16 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
If (Zugauswertung) then
    Exit;

Prior_2:='12345678 ';
If Zugauswertung then
    Exit;

Prior_1:='12345678 ';
Prior_2:=Prior (Suchstring[5],' ',2,true);
Prior_2:=Prior (Suchstring[6],Prior_2,4,true);
Prior_2:=Prior (Suchstring[17],Prior_2,2,true);
Prior_2:=Prior (Suchstring[17],Prior_2,4,true);

If Zugauswertung then
    Exit;

Prior_2:=' ';
For K:=7 to 12 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
For K:=7 to 12 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
If Zugauswertung then
    Exit;

Prior_2:=' ';
For K:=13 to 16 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
For K:=13 to 16 do
    Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
If Zugauswertung then
    Exit;

Spalte:=Last_2;
If not (Warnung) then
    If (Kontrolle) then
        Begin
        Zeichnen ('C',Farbe_Co);
        AktString ('C');
        Exit;
        End;

Spalte:=Last_1;
If not (Warnung) then
    If (Kontrolle) then
        Begin
        Zeichnen ('C',Farbe_Co);
        AktString ('C');
        Exit;
        End;

For Spalte:=1 to 8 do
    If not (Warnung) and (Kontrolle) then
        Begin
        Zeichnen ('C',Farbe_Co);
        AktString ('C');
        Exit;
        End;

For Spalte:=1 to 8 do
    If (Kontrolle) then
        Begin
        Zeichnen ('C',Farbe_Co);
        AktString ('C');
        Exit;
        End;
End; {Procedure Computer_Zug}

{--------------------------------------------------------------------------}
{------------------     Daten speichern     -------------------------------}
{--------------------------------------------------------------------------}

Procedure Godat;
Var I   :Byte;

Begin
Assign(Datja,'C:\TMP\TESTJA.DAT');
Rewrite (Datja);
Writeln(Datja,'nein');
Close(Datja);

Assign(Dat1,'C:\TMP\TEST.DAT');
Rewrite (Dat1);
For I:=1 to 8 do
    Writeln(Dat1,Waag[i]);
For I:=1 to 8 do
    Writeln(Dat1,Senk[i]);
For I:=1 to 9 do
    Writeln(Dat1,Reob[i]);
For I:=1 to 9 do
    Writeln(Dat1,Liob[i]);
Close(Dat1);

Assign(Datja,'C:\TMP\TESTJA.DAT');
Rewrite (Datja);
Writeln(Datja,'ja');
Close(Datja);
End;  {Procedure Godat}

{--------------------------------------------------------------------------}
{------------------     Schlu·meldung     ---------------------------------}
{--------------------------------------------------------------------------}

Procedure Schluss;
Begin

SetViewPort (0,Y(340)+TextHeight('I'),X(639),Y(479),true);
ClearViewPort;
Case Gewinner of
    Computer:      OutTextXY (10,Y(50),'étsch ,  ich  habe  gewonnen .');
    Spieler:       OutTextXY (10,Y(50),'Herzlichen  GlÅckwunsch ,  Sie  sind  besser ,  als  ich  dachte !');
    Niemand:       Begin
                   SetColor(Blue);
                   OutTextXY (10,Y(50),'Spiel  durch  "Abbruch"  beendet');
                   End;
    Unentschieden: Begin
                   SetColor (Blue);
                   OutTextXY (10,Y(50),'Das  Spiel  ist  unentschieden')
                   End;
    End;  {Case}
End;      {Procedure Schluss}

{--------------------------------------------------------------------------}
{------------------     HAUPTPROGRAMM     ---------------------------------}
{--------------------------------------------------------------------------}

BEGIN                                  {Hauptprogramm}
Grafik;                                {Grafik initialisieren}
Titel;                                 {Titelbild}
Neustart:                              {Neuanfang}
Init;                                  {Einstellungen initialisieren}
Spielregeln;                           {ErklÑrung der Spielregeln}
Anfang;                                {Einstellung der Anfangsbedingungen}
Grafik;
Spielfeld;                             {Zeichnen des Spielfeldes}
Textzeile(1);                          {Befehlszeile drucken}
Godat;                                 {Zug auf Festplatte speichern}
If Beginner then                       {TRUE: Spieler beginnt}
    Spieler_Zug                        {Wahl, Farbe, Zeichnen}
Else
    Spalte:=4;                         {    erster     }
Godat;
Farbe:=Farbe_Co;                       {  Computerzug  }
If Kontrolle then
    Begin                              {      ist      }
    Zeichnen('C',Farbe_Co);            {   definiert   }
    AktString('C');
    End;
Godat;

Repeat

    Spieler_Zug;
    Godat;
    Computer_Zug;
    Godat;

Until Spielende;                       {max. 64 ZÅge}

Schluss;

Textzeile (3);
Repeat
    Readln(Abfrage);
Until (Abfrage='e') or (Abfrage='E') or (Abfrage='');
If (Abfrage='') then
    Goto Neustart
Else
    Begin
    RestoreCrtMode;
    Exit;
    End;

END.                                   {Hauptprogramm}





