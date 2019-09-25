/*
   This is as straight a port of the original code as I can manage.
   I'm not addressing any stylistic or fundamental issues with the implementation,
   such as the use of global variables the some arrays indexed from 1 instead of 0
*/

// Program Vier_Gewinnt (Dat1,Datja);

// Uses Graph, Crt;                                 {Grafik- und Normalmodus}

// Label   Neustart;

// Var     GraphDriver, GraphMode,                  {Grafikauswahl}
// 		Code,                                    {Stringumwandlung}
// 		I,J,K                                    {Schleifendummy's}
// 												 :Integer;
let I, J, K;

// 		Spalte, Zeile,
let Spalte, Zeile;

// 		Zahl, Nr,                                {Eingabe (Int)}
// 		GewSSt, GewZSt, Richtung,                {Gewinnzeilen, -Spalten}
// 		Last_1, Last_2                           {Letzte 2 Zge}
// 												 :Byte;
let Zahl, Nr, GewSSt, GewZSt, Richtung, Last_1, Last_2;

// 		Abfrage,                                 {allgemeine Eingabe}
// 		Farbe,
// 		Farbe_Sp,                                {Farbe des Gegners}
// 		Farbe_Co,                                {Farbe des Computers}
// 		Prior_1, Prior_2                         {Steuerung Computerzug}
// 												 :String[10];
let Abfrage, Farbe, Farbe_Sp, Farbe_Co, Prior_1, Prior_2;

// 		Zeichen                                  {Hilfsgráe}
// 												 :String[1];
let Zeichen;

// 		Bst                                      {Hilfsgráe}
// 												 :Char;
let Bst;

// 		Beginner,                                {true: Spieler beginnt}
// 		Spielende                                {true: Spielende}
// 												 :boolean;
let Beginner, Spielende = true;

// 		Waag,  Senk,  Liob,  Reob                :Array [0..9] of String[8];
let Waag = makeArray( makeString( 8 ), 0, 9 );
let Senk = makeArray( makeString( 8 ), 0, 9 );
let Liob = makeArray( makeString( 8 ), 0, 9 );
let Reob = makeArray( makeString( 8 ), 0, 9 );

// 		Suchstring                               :Array [1..19] of String[5];
let Suchstring = makeString( makeString( 5 ), 1, 19 );

// 		Platz                                    :Array [1..8,0..8] of Char;
let Platz = makeArray( 'x', 1, 8, 0, 8 );

// 		Zug                                      :Array [1..64] of Byte;
let Zug = makeArray( 33, 1, 64 );

// 		Gewinner                                 :(Spieler,Computer,
// 												  Niemand,Unentschieden);
const GEWINNER_STATES = {Spieler:1,Computer:2,Niemand:3,Unentschieden:4};
let Gewinner = GEWINNER_STATES.Unentschieden;

// 		dat1, datja                              :text;
let dat1 = '';
let datja = '';

// {------------------     UNTERPROGRAMME     --------------------------------}

// {--------------------------------------------------------------------------}
// {------------------     Einstellungen initialisieren     ------------------}
// {--------------------------------------------------------------------------}

// Procedure Init;
const Init = function() {
	// Begin
	for ( Spalte = 1 ; Spalte <= 8 ; Spalte++ ) // For Spalte:=1 to 8 do
	{ 	// 	Begin
		Platz[ Spalte ][ 0 ] = 'o'; // 	Platz[Spalte,0]:='o';
		for ( Zeile = 1 ; Zeile <= 8 ; Zeile++ ) {// 	For Zeile:=1 to 8 do
			Platz[ Spalte ][ Zeile ] = 'O';// 		Platz[Spalte,Zeile]:='O';
		}
	} 	// 	End;
	for ( I = 1 ; I <= 64 ; I++ ) {  // For I:=1 to 64 do
		Zug[ I ] = 0; // 	Zug[I]:=0;
	}
	for( I = 1 ; I <= 8 ; I++ ) // For I:=1 to 8 do
	{ 	// 	Begin
		Waag[I] ='OOOOOOOO'; // 	Waag[I]:='OOOOOOOO';
		Senk[I] ='OOOOOOOO'; // 	Senk[I]:='OOOOOOOO';
	} 	// 	End;
	for ( I = 1 ; I <= 9 ; I++ )    // For I:=1 to 9 do
	{	// 	Begin
		Reob[I] = '';            	// 	Reob[I]:='';
		Liob[I] = '';            	// 	Liob[I]:='';
		for( J = 1 ; J <= (8-abs(5-I)) ; J++ ) // 	For J:=1 to (8-abs(5-I)) do
		{               	// 		Begin
			Reob[I] = Reob[I]+'O';	// 		Reob[I]:=Reob[I]+'O';
			Liob[I] = Liob[I]+'O';	// 		Liob[I]:=Liob[I]+'O';
		}  	// 		End; {For-J-Begin}
	} // 	End;     {For-I-Begin}
	Suchstring[1] = 'CCCC';  	// Suchstring[1]:='CCCC';
	Suchstring[2] = 'SSSS';  	// Suchstring[2]:='SSSS';
	Suchstring[3] = 'OOSSO'; 	// Suchstring[3]:='OOSSO';
	Suchstring[4] = 'OSSOO'; 	// Suchstring[4]:='OSSOO';
	Suchstring[5] = 'OOCCO'; 	// Suchstring[5]:='OOCCO';
	Suchstring[6] = 'OCCOO'; 	// Suchstring[6]:='OCCOO';
	Suchstring[7] = 'CCOO';  	// Suchstring[7]:='CCOO';
	Suchstring[8] = 'COCO';  	// Suchstring[8]:='COCO';
	Suchstring[9] = 'COOC';  	// Suchstring[9]:='COOC';
	Suchstring[10] = 'OCCO'; 	// Suchstring[10]:='OCCO';
	Suchstring[11] = 'OCOC'; 	// Suchstring[11]:='OCOC';
	Suchstring[12] = 'OOCC'; 	// Suchstring[12]:='OOCC';
	Suchstring[13] = 'COOO'; 	// Suchstring[13]:='COOO';
	Suchstring[14] = 'OCOO'; 	// Suchstring[14]:='OCOO';
	Suchstring[15] = 'OOCO'; 	// Suchstring[15]:='OOCO';
	Suchstring[16] = 'OOOC'; 	// Suchstring[16]:='OOOC';
	Suchstring[17] = 'OOCOO';	// Suchstring[17]:='OOCOO';
	Suchstring[18] = 'SOSOS';	// Suchstring[18]:='SOSOS';
	Suchstring[19] = 'OSOSO';	// Suchstring[19]:='OSOSO';
	Nr = 0;                  	// Nr:=0;
	Spalte = 0;              	// Spalte:=0;
	Zeile = 0;               	// Zeile:=0;
	Last_1 = 0;              	// Last_1:=0;
	Last_2 = 0;              	// Last_2:=0;
	Gewinner = GEWINNER_STATES.Niemand;      	// Gewinner:=Niemand;
	Spielende = false;       	// Spielende:=false;
	GewZSt = 0;              	// GewZSt:=0;
	GewSSt = 0;              	// GewSSt:=0;
};	// End; {Procedure Init}

// {--------------------------------------------------------------------------}
// {------------------     Graphik initialisieren     ------------------------}
// {--------------------------------------------------------------------------}

// Procedure Grafik;
const Grafik = function() 
{ // Begin
	// GraphDriver:=Detect;
	InitGraph(); // InitGraph (GraphDriver,GraphMode,'./bgi'); 
} // End; {Procedure Grafik}

// {--------------------------------------------------------------------------}
// {------------------     Grafik-Umrechnung     -----------------------------}
// {--------------------------------------------------------------------------}

// Function X (X_Koord: Integer): Integer;
const X = function( X_Koord )
{ // Begin
	return Round(GetMaxX/639*X_Koord); // X:= Round(GetMaxX/639*X_Koord);
} // End;

// Function Y (Y_Koord: Integer): Integer;
const Y = function( Y_Koord ) 
{ // Begin
	return Round(GetMaxY/480*Y_Koord); // Y:= Round(GetMaxY/480*Y_Koord);
} // End;

// {--------------------------------------------------------------------------}
// {------------------     Titelbild     -------------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Titel;
const Titel = function( callback )
{ // Begin
	SetViewPort (0,0,X(639),Y(479),true);                                            // SetViewPort (0,0,X(639),Y(479),true);
	ClearViewPort();                                                                 // ClearViewPort;
	SetTextStyle (TriplexFont,0,10);                                                 // SetTextStyle (TriplexFont,0,10);
	SetTextJustify (0,0);                                                            // SetTextJustify (0,0);
	SetBkColor (White);                                                              // SetBkColor (White);
	SetColor (Blue);                                                                 // SetColor (Blue);
	SetFillStyle (EmptyFill,White);                                                  // SetFillStyle (EmptyFill,White);
	OutTextXY (5,Y(120),'4 Gewinnt');                                                // OutTextXY (5,Y(120),'4 Gewinnt');
	setTimeout(
		function() {
			SetTextStyle (1,0,1);                                                            // SetTextStyle (1,0,1);
			Bar3D (X(145),Y(200)+2*TextHeight('I'),X(490),Y(200)-TextHeight('I')-3,          // Bar3D (X(145),Y(200)+2*TextHeight('I'),X(490),Y(200)-TextHeight('I')-3,
				  8,true);                                                                   // 	  8,true);
			OutTextXY (X(150),Y(200),'Studienarbeit von DIETER HEININGER');                  // OutTextXY (X(150),Y(200),'Studienarbeit von DIETER HEININGER');
			OutTextXY (X(150),Y(200)+TextHeight('I')+3,                                      // OutTextXY (X(150),Y(200)+TextHeight('I')+3,
					  '    im Semester MF 4  (SS 1990)');                                    // 		  '    im Semester MF 4  (SS 1990)');
			OutTextXY (X(80),Y(360),'Dieses Programm soll die enorme Leistungsfhigkeit');// OutTextXY (X(80),Y(360),'Dieses Programm soll die enorme Leistungsfhigkeit');
			OutTextXY (X(80),Y(360)+TextHeight('I')+3,                                       // OutTextXY (X(80),Y(360)+TextHeight('I')+3,
					  '    von Computern (und MF-Studenten) beweisen.');                     // 		  '    von Computern (und MF-Studenten) beweisen.');
			Readln( callback ); 															 // Readln;              {Weiter gehts}
		}
		, 200  																				 // Delay (200);
	);
} // End; {Procedure titel}
	

// {--------------------------------------------------------------------------}
// {------------------     Spielregeln     -----------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Spielregeln;
const Spielregeln = function( callback ) 
{ 	// Begin
	RestoreCrtMode();                                                                   			// RestoreCrtMode;
	Writeln();                                                                          			// Writeln;
	TextColor(LightGreen);                                                            			// TextColor(LightGreen);
	Write('Bentigen Sie die Spielregeln (j/');                                			// Write('Bentigen Sie die Spielregeln (j/');
	TextColor(LightCyan+Blink);                                                       			// TextColor(LightCyan+Blink);
	Write('n');                                                                       			// Write('n');
	TextColor(LightGreen);                                                            			// TextColor(LightGreen);
	Writeln(')?');                                                                    			// Writeln(')?');
	Readln(
		function( Abfrage ) {                                                                  			// Readln(Abfrage);
			Writeln( '>' + Abfrage );
			if( 'j' === Abfrage.toLowerCase() ) {                                            			// If (Abfrage<>'j') and (Abfrage<>'J') then
				Exit();                                                                       			// 	Exit
			} else {                                                                              			// Else
				TextColor(LightCyan);                                                         			// 	TextColor(LightCyan);
				Writeln;                                                                      			// 	Writeln;
				Writeln('Das Spielfeld besteht aus einer senkrecht stehenden 8x8-Feld-Matrix.');			// 	Writeln('Das Spielfeld besteht aus einer senkrecht stehenden 8x8-Feld-Matrix.');
				Writeln('Wenn man eine Spalte mit einem Spielstein whlen will, so fllt');			// 	Writeln('Wenn man eine Spalte mit einem Spielstein whlen will, so fllt');
				Writeln('dieser bis auf den tiefsten freien Platz dieser Spalte.');           			// 	Writeln('dieser bis auf den tiefsten freien Platz dieser Spalte.');
				Writeln('Ziel des Spiels ist es, 4 Spielsteine auf benachbarte Pltze');			// 	Writeln('Ziel des Spiels ist es, 4 Spielsteine auf benachbarte Pltze');
				Writeln('zu bringen, wobei es gleichgltig ist, ob die Steine waagrecht,');			// 	Writeln('zu bringen, wobei es gleichgltig ist, ob die Steine waagrecht,');
				Writeln('senkrecht oder diagonal auf dem Brett liegen.');                     			// 	Writeln('senkrecht oder diagonal auf dem Brett liegen.');
				Writeln;                                                                      			// 	Writeln;
				TextColor(LightGreen+Blink);                                                  			// 	TextColor(LightGreen+Blink);
				Write('<RETURN> ');                                                           			// 	Write('<RETURN> ');
				TextColor(LightGreen);                                                        			// 	TextColor(LightGreen);
				Writeln('drcken!');                                                   			// 	Writeln('drcken!');
				Readln( callback );                                                                       			// 	Readln;
			}                                                             			// 	End; {Else-Begin}
		}
	);
}; 	// End; {Procedure Spielregeln}

// {--------------------------------------------------------------------------}
// {------------------     Anfangseinstellungen     --------------------------}
// {--------------------------------------------------------------------------}

// Procedure Anfang;
const Anfang = function( callback ) 
	{ // Begin

	// {------------------     Wahl der Spielfarbe     --------------------------}
	// Repeat
	Writeln();                                 // 	Writeln;
	Write('Whlen Sie Ihre Spielfarbe (');  // 	Write('Whlen Sie Ihre Spielfarbe (');
	TextColor(LightCyan+Blink);                // 	TextColor(LightCyan+Blink);
	Write('rot');                              // 	Write('rot');
	TextColor(LightGreen);                     // 	TextColor(LightGreen);
	Writeln('/weiá)');                         // 	Writeln('/weiá)');

	// {------------------     Wahl des Spielanfangs     --------------------------}
	let Wahl_callback = function() {
		Writeln();                                             	// Writeln;
		Write('Wollen Sie anfangen ');                         	// Write('Wollen Sie anfangen ');
		TextColor(LightCyan+Blink);                            	// TextColor(LightCyan+Blink);
		Write('( --> j )');                                    	// Write('( --> j )');
		TextColor(LightGreen);                                 	// TextColor(LightGreen);
		Writeln(' oder soll der Computer beginnen ( --> n )?');	// Writeln(' oder soll der Computer beginnen ( --> n )?');
		Graph.line.removeAttribute( 'disabled' );
		Readln( 	                                       	// Readln(Abfrage);
			function( Abfrage ) {
				Abfrage = Abfrage.toLowerCase();
				if ( 'j' === Abfrage || '' == Abfrage ) {	// If (Abfrage='j') or (Abfrage='J') or (Abfrage='') then
					Beginner = true                         // 	Beginner:=true
				} else {                                    // Else
					Beginner = false;                       // 	Beginner:=false;
				}
				callback();
			}
			, 'fuck'
		);
	};

	let Abfrage_callback = function( Abfrage ) {
		// Until (Abfrage='weiá') or (Abfrage='rot') or (Abfrage='');
		if ( 'weiá' === Abfrage || 'rot' === Abfrage || '' === Abfrage ) {
			Writeln( '>' + Abfrage );

			if (Abfrage==='weiá') 		// If (Abfrage='weiá') then
			{                   		// Begin
				Farbe_Sp = 'white';  	// 	Farbe_Sp:='white';
				Farbe_Co = 'red'     	// 	Farbe_Co:='red'
			}                     		// End
			else                    	// Else
			{                   		// Begin
				Farbe_Sp = 'red';    	// 	Farbe_Sp:='red';
				Farbe_Co = 'white';  	// 	Farbe_Co:='white';
			}                   		// End;

			Wahl_callback();
		} else {
			return true; // try-try-again...
		}
	};
	Readln( Abfrage_callback ); 	           // 	Readln(abfrage);

} // End; {Procedure Anfang}

// {--------------------------------------------------------------------------}
// {------------------     Spielfeld zeichnen     ----------------------------}
// {--------------------------------------------------------------------------}

const Spielfeld = function() 										  // Procedure Spielfeld;
{ 																	  // Begin
	SetViewPort (0,0,X(639),Y(336)+3*TextHeight('I'),true);           // SetViewPort (0,0,X(639),Y(336)+3*TextHeight('I'),true);
	ClearViewPort();                                                  // ClearViewPort;
	SetTextStyle (TriplexFont,0,1);                                   // SetTextStyle (TriplexFont,0,1);
	SetTextJustify (1,0);                                             // SetTextJustify (1,0);
	SetBkColor (LightGray);                                           // SetBkColor (LightGray);
	SetColor (Blue);                                                  // SetColor (Blue);
	for( Spalte = 1 ; Spalte <= 8; Spalte++ )                         // For Spalte := 1 to 8 do
	{                                                                 // 	Begin
		Zeichen = Spalte + ''; 	                                      // 	Str(Spalte,Zeichen);
		OutTextXY (X(130+Spalte*42),Y(336)+TextHeight('I'),Zeichen);  // 	OutTextXY (X(130+Spalte*42),Y(336)+TextHeight('I'),Zeichen);
		for ( Zeile = 1 ; Zeile <= 8 ; Zeile++ ) {                    // 	For Zeile := 1 to 8 do
			Rectangle (X(110+Spalte*42),Y(Zeile*42-40),               // 		Rectangle (X(110+Spalte*42),Y(Zeile*42-40),
			X(150+Spalte*42),Y(Zeile*42));                            // 		X(150+Spalte*42),Y(Zeile*42));
		}                                                             //
	}							                                      // 	End; {For-Spalte-Begin}
	Line (0,Y(336)+TextHeight('I')+3,X(639),Y(336)+TextHeight('I')+3);// Line (0,Y(336)+TextHeight('I')+3,X(639),Y(336)+TextHeight('I')+3);
} 																	  // End; {Procedure Spielfeld}

// {--------------------------------------------------------------------------}
// {------------------     Textzeile      ------------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Textzeile(Zahl:Byte);
const Textzeile = function( Zahl ) 
{ 	// Begin
	SetViewPort (0,Y(479)-TextHeight('Ip')-5,X(639),Y(479),true);                   // SetViewPort (0,Y(479)-TextHeight('Ip')-5,X(639),Y(479),true);
	ClearViewPort();                                                                // ClearViewPort;
	Line (0,0,X(639),0);                                                            // Line (0,0,X(639),0);
	SetTextJustify (0,0);                                                           // SetTextJustify (0,0);
	SetColor (Blue);                                                                // SetColor (Blue);
	switch( Zahl ) {                                                                // Case Zahl of
		case 1: OutTextXY (X(10),TextHeight('Ip')+2,                                    // 	1: OutTextXY (X(10),TextHeight('Ip')+2,
		   '1 . . 8 :  Spalten  whlen ,      A : Abbrechen');               		// 	   '1 . . 8 :  Spalten  whlen ,      A : Abbrechen');
		case 2: OutTextXY (X(10),TextHeight('Ip')+2,                                    // 	2: OutTextXY (X(10),TextHeight('Ip')+2,
		   'S :  Spiel  speichern ,        L :  Spiel  laden,        E: Programmende'); // 	   'S :  Spiel  speichern ,        L :  Spiel  laden,        E: Programmende');
		case 3: OutTextXY (X(10),TextHeight('Ip')+2,                                    // 	3: OutTextXY (X(10),TextHeight('Ip')+2,
		   '<RETURN> :  Weiterspielen ,     "E" + <RETURN> :  Spielende');          	// 	   '<RETURN> :  Weiterspielen ,     "E" + <RETURN> :  Spielende');
	}                                                                     				// End; {Case}
}; // End; {Procedure Textzeile}

// {--------------------------------------------------------------------------}
// {------------------     Kontrolle zum Zeilensetzen     --------------------}
// {--------------------------------------------------------------------------}

// Function Kontrolle: Boolean;
const Kontrolle = function() 
{ // Begin
	Zeile = 0;                            // Zeile:=0;
	do {                                  // Repeat
		Zeile++;                          // 	Inc (Zeile);
	} while (Platz[Spalte][Zeile]!='O');  // Until (Platz[Spalte,Zeile]='O');
	if (Zeile>8) {                        // If (Zeile>8) then
		Kontrolle = false                  // 	Kontrolle:=false
	} else {                              // else
		Kontrolle = true;                  // 	Kontrolle:=true;
	}
	return Kontrolle;
} // End; {Function Kontrolle}

// {--------------------------------------------------------------------------}
// {------------------     Spieler setzt     ---------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Wahl;
// Var I: Integer;
const Wahl = function( callback )
{ // Begin
	SetViewPort (0,Y(390),X(639),Y(450),true);                                     // SetViewPort (0,Y(390),X(639),Y(450),true);
	ClearViewPort();                                                                 // ClearViewPort;
	SetColor (Blue);                                                               // SetColor (Blue);
	OutTextXY (X(10),TextHeight('Ip'),'Welche Spalte mchten Sie setzen?');     // OutTextXY (X(10),TextHeight('Ip'),'Welche Spalte mchten Sie setzen?');
	// Repeat
	// 	Bst:=ReadKey;
	// 	Val (Bst,Spalte,Code);
	// Until ((Spalte>0) and (Spalte<9) and (Code=0) and (Kontrolle))
	// or (Bst='a') or (Bst='A');
	Readln(
		function( Bst ) {
			Spalte = parseInt( Bst );
			let ok = ((Spalte>0) && (Spalte<9) && (Code===0) && (Kontrolle)) || (Bst==='a') || (Bst=='A');
			if ( !ok ) return true;
			OutTextXY (X(330),TextHeight('Ip'),Bst);  // OutTextXY (X(330),TextHeight('Ip'),Bst);
			if ( Bst==='a' || Bst==='A' )             // If (Bst='a') or (Bst='A') then
			{                                    	  // 	Begin
				Spielende = true;                     // 	Spielende:=true;
				Gewinner = GEWINNER_STATES.Niemand;   // 	Gewinner:=Niemand;
				Exit();                               // 	Exit;
			}                 						  // 	End;  {If-(Bst..)-Begin}
		}
	)
} // End;      {Procedure Wahl}

// {--------------------------------------------------------------------------}
// {------------------     Zeichnen, Speichern     ---------------------------}
// {--------------------------------------------------------------------------}

const Zeichnen = function( Wert, Col, callback ) {					 // Procedure Zeichnen (Wert:Char; Col:String);
	let i;															 // Var I: ShortInt;
																	 // 
																	 // Begin
	SetViewPort (0,0,X(639),Y(353),true);							 // SetViewPort (0,0,X(639),Y(353),true);
	//For I:=0 to 3 do												 // For I:=0 to 3 do

	let I = 0;
	let interval = false;
	let Zeichnen_draw = function() 
	{ 																// Begin
		if ( Odd(I) ) {												// If Odd(I) then
			if (Col=='red') {										// If (Col='red') then
																	// Begin
				SetFillStyle (SolidFill,Red);						// SetFillStyle (SolidFill,Red);
				SetColor (Red);										// SetColor (Red);
																	// End
			} else {												// Else
																	// Begin
				SetFillStyle (SolidFill,White);						// SetFillStyle (SolidFill,White);
				SetColor(White);									// SetColor(White);
			}														// End
		} else {													// Else
																	// Begin
			SetColor (LightGray);									// SetColor (LightGray);
			SetFillStyle (Solidfill,LightGray);						// SetFillStyle (Solidfill,LightGray);
		}															// End;
		FillEllipse (X(130+Spalte*42),Y(358-Zeile*42),X(18),Y(18));	// FillEllipse (X(130+Spalte*42),Y(358-Zeile*42),X(18),Y(18));


		if ( ++i >2 ) {
			clearInterval( interval );
			callback();
		}
	};																// End;
	interval = setInterval( Zeichnen_draw, 300 ); 					// Delay(300);

	Platz[Spalte][Zeile] = Wert;									// Platz[Spalte,Zeile]:=Wert;
	Nr++;															// Inc (Nr);
	Zug[Nr] = Spalte;												// Zug[Nr]:=Spalte;
	Last_2 = Last_1;												// Last_2:=Last_1;
	Last_1 = Spalte;												// Last_1:=Spalte;

	if ( Nr == 64 ) {												// If Nr=64 then
		Spielende = true;												// Spielende:=true;
	}
};	 																// End; {Procedure Zeichnen}

// {--------------------------------------------------------------------------}
// {------------------     Markierung des Siegervierers     ------------------}
// {--------------------------------------------------------------------------}

const Markierung = function(Col,callback) {							 			// Procedure Markierung(Col:String);
	let I;														 				// Var I: Integer;
	// 
	// Begin
	SetViewPort (0,0,X(639),Y(353),true);								 		// SetViewPort (0,0,X(639),Y(353),true);
	let interval = false;
	let Markierung_draw = function() { 											// 	Begin
		if ( Odd(I) ) {														 	// 	If Odd(I) then
			if (Col=='red') {													// 		If (Col='red') then
																				// 			Begin
				SetColor (Red);													// 			SetColor (Red);
				SetFillStyle (SolidFill,Red);									// 			SetFillStyle (SolidFill,Red);
																				// 			End
			} else {															// 		Else
																				// 			Begin
				SetColor (White);											 	// 			SetColor (White);
				SetFillStyle (Solidfill,White);									// 			SetFillStyle (Solidfill,White);
			}																 	// 			End
		} else {																// 	Else
																				// 		Begin
			SetColor (LightGray);												// 		SetColor (LightGray);
			SetFillStyle (Solidfill,LightGray);								 	// 		SetFillStyle (Solidfill,LightGray);
		}																 		// 		End;
		switch( Richtung ) {													// 	Case Richtung of
			case 1: 															// 	1: Begin
				FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18)); 	// 	   FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				FillEllipse (X(88+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18)); 	// 	   FillEllipse (X(88+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));
				FillEllipse (X(46+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));		// 	   FillEllipse (X(46+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));
				FillEllipse (X(4+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));		// 	   FillEllipse (X(4+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));
				break;															// 	   End;
			case 2: 															// 	2: Begin
				FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				FillEllipse (X(130+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(130+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));
				FillEllipse (X(130+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(130+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));
				FillEllipse (X(130+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(130+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));
				break;															// 	   End;
			case 3: 															// 	3: Begin
				FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				FillEllipse (X(172+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(172+GewSSt*42),Y(316-GewZSt*42),X(18),Y(18));
				FillEllipse (X(214+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(214+GewSSt*42),Y(274-GewZSt*42),X(18),Y(18));
				FillEllipse (X(256+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(256+GewSSt*42),Y(232-GewZSt*42),X(18),Y(18));
				break;															// 	   End;
			case 4: // 	4: Begin
				FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18)); 	// 	   FillEllipse (X(130+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				FillEllipse (X(172+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(172+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				FillEllipse (X(214+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(214+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				FillEllipse (X(256+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));	// 	   FillEllipse (X(256+GewSSt*42),Y(358-GewZSt*42),X(18),Y(18));
				break;															// 	   End;
		}  														 				// 	End;  {Case}
		if ( ++i >= 7 ) { 														// For I:=0 to 7 do
			clearInterval( interval ); 											// 	End;  {For-I-Begin}
			callback();
		}
	};
	interval = setInterval( Markierung_draw, 400 ); // 	Delay (400);
}											 // End; {Procedure Markierung}

// {--------------------------------------------------------------------------}
// {------------------     Aktualisierung der Strings     --------------------}
// {--------------------------------------------------------------------------}


const AktString = function( wert ) 		// Procedure AktString (Wert: Char);
{ 										// Begin
	let Num, Stelle; 			   		// Var    Num, Stelle:  ShortInt;
	Waag[ Zeile ][ Spalte ] = Wert;		// Waag[Zeile,Spalte]:=Wert;
	Senk[ Spalte ][ Zeile ] = Wert;		// Senk[Spalte,Zeile]:=Wert;
	Num = Spalte - Zeile + 5   		    // Num:=Spalte-Zeile+5;                   {--------------}
	if( Num > 0 && Num < 10 ) 	   		// If (Num>0) and (Num<10) then
	{ 							   		// 	Begin
		if ( Num < 6 ) {  				// 	If (Num<6) then
			Stelle = Zeile + Num - 5; 	// 		Stelle:=Zeile+Num-5               {---  REOB  ---}
		} else { 						// 	Else
			Stelle = Zeile; 			// 		Stelle:=Zeile;
		}
		Reob[ Num ][ Stelle ] = Wert; 	// 	Reob[Num,Stelle]:=Wert;
	} 									// 	End; {If-Begin}                       {--------------}
	Num = -(Spalte+Zeile)+14			// Num:=-(Spalte+Zeile)+14;               {--------------}
	if( Num > 0 && Num < 10 ) 			// If (Num>0) and (Num<10) then
	{ 									// 	Begin
		if( Num < 6 ) { 				// 	If (Num<6) then
			Stelle = Zeile + Num - 5; 	// 		Stelle:=Zeile+Num-5               {---  LIOB  ---}
		} else { 						// 	Else
			Stelle = Zeile; 			// 		Stelle:=Zeile;
		}
		Liob[ Num ][ Stelle ] = Wert; 	// 	Liob[Num,Stelle]:=Wert;
	} 									// 	End; {If-Begin}                       {--------------}
}; // End; {Procedure AktString}

// {--------------------------------------------------------------------------}
// {------------------     Gewinnsuche     -----------------------------------}
// {--------------------------------------------------------------------------}

const Gewinnsuche = function(Wert) 			// Procedure Gewinnsuche(Wert:String);
{ 											// Begin
	let Num, Stelle;  						// Var    Num, Stelle:  ShortInt;

	// {----------------------------------     Waagrecht suchen     --------------}

	Stelle = Pos (Wert,Waag[Zeile]);		// Stelle:=Pos (Wert,Waag[Zeile]);
	if (Stelle!=0) 							// If (Stelle<>0) then
	{ 										// 	Begin
		GewZSt = Zeile;						//      GewZSt:=Zeile;
		GewSSt = Stelle;					//      GewSSt:=Stelle;
		Richtung = 4;						//      Richtung:=4;
		Spielende = true;					//      Spielende:=true;
	}										// 	End; {If-Begin}

	// {----------------------------------     Senkrecht suchen     --------------}

	Stelle = Pos (Wert,Senk[Spalte]); 		// Stelle:=Pos (Wert,Senk[Spalte]);
	if (Stelle!=0) 							// If (Stelle<>0) then
	{ 										// 	Begin
		GewZSt = Stelle;					//      GewZSt:=Stelle;
		GewSSt = Spalte;					//      GewSSt:=Spalte;
		Richtung = 2;						//      Richtung:=2;
		Spielende = true;					//      Spielende:=true;
	}										// 	End; {If-Begin}

	// {------------------------------     Schrg nach rechts oben suchen     ----}

	Num = Spalte-Zeile+5;					// Num:=Spalte-Zeile+5;
	if (Num>0 && Num<10) 					// If (Num>0) and (Num<10) then
	{										// 	Begin
		Stelle  = Pos (Wert,Reob[Num]);		// 	Stelle:=Pos (Wert,Reob[Num]);
		if (Stelle!=0) then					// 	If (Stelle<>0) then
		{ 									// 		Begin
			if (Num<6) {					// 		If (Num<6) then
				GewZSt = Stelle-Num+5		// 			GewZSt:=Stelle-Num+5
			} else {						// 		Else
				GewZSt = Stelle;			// 			GewZSt:=Stelle;
			}
			if (Num<6) {					// 		If (Num<6) then
				GewSSt = Stelle				// 			GewSSt:=Stelle
			} else {						// 		Else
				GewSSt = Stelle+Num-5;		// 			GewSSt:=Stelle+Num-5;
			}
			Richtung = 3;					// 		Richtung:=3;
			Spielende = true;				// 		Spielende:=true;
		}									// 		End; {If-Begin}
	}										// 	End;     {If-Begin}

	// {------------------------------     Schrg nach links oben suchen     -----}

	Num = -(Spalte+Zeile)+14;				// Num:=-(Spalte+Zeile)+14;
	If ( Num>0 && Num<10 ) 					// If (Num>0) and (Num<10) then
	{										// 	Begin 
			Stelle = Pos(Wert,Liob[Num]);	// 	Stelle:=Pos (Wert,Liob[Num]); 
			if (Stelle!=0) {				// 	If (Stelle<>0) then Begin																			 // 		Begin
				if (Num<6) {				// 		If (Num<6) then
					GewZSt = Stelle-Num+5	// 			GewZSt:=Stelle-Num+5
				} else {					// 		Else
					GewZSt = Stelle;		// 			GewZSt:=Stelle;
				} 							//
				if (Num<6) {				// 		If (Num<6) then
					GewSSt = 9-Stelle		// 			GewSSt:=9-Stelle
				} else {					// 		Else
					GewSSt = 14-Stelle-Num;	// 			GewSSt:=14-Stelle-Num;
				} 							//
				Richtung = 1;				// 		Richtung:=1;
				Spielende = true;			// 		Spielende:=true;
			}								// 		End; {If-Begin}
	}										// 	End;     {If-Begin}

	if (Wert=='SSSS' && Spielende) 			// If (Wert='SSSS') and (Spielende) then
	{										// 	Begin
		Gewinner = Spieler;					// 	Gewinner:=Spieler;
		Farbe    = Farbe_Sp;				// 	Farbe:=Farbe_Sp;
	}										// 	End;
	if (Wert=='CCCC' && Spielende) 			// If (Wert='CCCC') and (Spielende) then
	{										// 	Begin
		Gewinner = Computer;				// 	Gewinner:=Computer;
		Farbe    = Farbe_Co;				// 	Farbe:=Farbe_Co;
	}										// 	End;
} // End; {Procedure Gewinnsuche}

// {--------------------------------------------------------------------------}
// {------------------     Stringsuche mit Priorittsprfung     -------------}
// {--------------------------------------------------------------------------}

// {------------------     Hilfsfunktion     ---------------------------------}

const Dummy_1 = function(Wert, Pr)				// Function Dummy_1 (Wert, Pr: String):String;
{												// Begin
												// 
	let j;										// Var J: Integer;
	if (Platz[Spalte][Zeile-1] != 'O') 			// If (Platz[Spalte,Zeile-1]<>'O') then
	{											// 	Begin
		Zeichen = Spalte + ''; 					// 	Str (Spalte:1,Zeichen);// valerie: what is this :1?
		for ( j = 0 ; j < pr.lenght ; j++ ) { 	// 	For J:=1 to Length (Pr) do
			if (Pr[J]=Zeichen) {				// 		If (Pr[J]=Zeichen) then
				Zeichen = '';					// 			Zeichen:='';
			} 									// 
		} 										//
		Insert (Zeichen,Pr,1);					// 	Insert (Zeichen,Pr,1);
	}						 					// 	End; {If-(Platz..)-Begin}
	Dummy_1 = Pr;					 			// Dummy_1:=Pr;
}							 					// End; {Function Dummy_1}

// {------------------     Hilfsprozedur (Rechts Oben)     -------------------}

// Procedure Dummy_Reob (Stelle, Num: ShortInt);

// Begin
// If (Num<6) then
// 	Begin
// 	Zeile:=Stelle-Num+5;
// 	Spalte:=Stelle;
// 	End
// Else
// 	Begin
// 	Zeile:=Stelle;
// 	Spalte:=Stelle+Num-5;
// 	End;
// End; {Procedure Dummy_Reob}

// {------------------     Hilfsprozedur (Links Oben)     --------------------}

// Procedure Dummy_Liob (Stelle, Num: ShortInt);

// Begin
// If (Num<6) then
// 	Begin
// 	Zeile:=Stelle-Num+5;
// 	Spalte:=9-Stelle;
// 	End
// Else
// 	Begin
// 	Zeile:=Stelle;
// 	Spalte:=14-Stelle-Num;
// 	End;
// End; {Procedure Dummy_Liob}

// {--------------------------------------------------------------------------}

// Function Prior (Wert, Pri: String; Zahl: Byte; Setzen: Boolean): String;
// Var    Num, Stelle:  ShortInt;
// 	   I, J:         Integer;
// 	   Stop:         Boolean;

// Begin
// Stop:=false;

// {--------------------     Schrg nach rechts oben suchen/Prioritt     ----}
// For Num:=1 to 9 do
// 	Begin
// 	Stelle:=Pos (Wert,Reob[Num]);
// 	If (Stelle<>0) then
// 		Begin
// 		If (Setzen) then
// 			For J:=0 to (Length (Wert)-1) do
// 				Begin
// 				Dummy_Reob (Stelle+J, Num);
// 				If (Platz[Spalte,Zeile]='O')
// 				and (Platz[Spalte,Zeile-1]='O') then
// 					Stop:=true;
// 				End;  {For-J-Begin}
// 		If not (Stop) then
// 			If (Zahl<>0) then
// 				Begin
// 				Dummy_Reob (Stelle+Zahl-1, Num);
// 				Pri:=Dummy_1 (Wert, Pri);
// 				End
// 			Else
// 				Begin
// 				For I:=0 to ((Length(Wert))-1) do
// 					If (Wert[I+1]='O') then
// 						Begin
// 						Dummy_Reob (Stelle+I, Num);
// 						Pri:=Dummy_1 (Wert, Pri);
// 						End  {If-(Wert..)-Begin}
// 				End;     {Else-Begin}
// 		End;             {If-(Stelle..)-Begin}
// 	End;                 {For-Num-Begin}

// {--------------------     Schrg nach links oben suchen/Prioritt     -----}
// Stop:=false;
// For Num:=1 to 9 do
// 	Begin
// 	Stelle:=Pos (Wert,Liob[Num]);
// 	If (Stelle<>0) then
// 		Begin
// 		If (Setzen) then
// 			For J:=0 to (Length (Wert)-1) do
// 				Begin
// 				Dummy_Liob (Stelle+J, Num);
// 				If (Platz[Spalte,Zeile]='O')
// 				and (Platz[Spalte,Zeile-1]='O') then
// 					Stop:=true;
// 				End;  {For-J-Begin}
// 		If not (Stop) then
// 			If (Zahl<>0) then
// 				Begin
// 				Dummy_Liob (Stelle+Zahl-1, Num);
// 				Pri:=Dummy_1 (Wert, Pri);
// 				End
// 			Else
// 				Begin
// 				For I:=0 to ((Length(Wert))-1) do
// 					If (Wert[I+1]='O') then
// 						Begin
// 						Dummy_Liob (Stelle+I, Num);
// 						Pri:=Dummy_1 (Wert, Pri);
// 						End;  {If-(Wert..)-Begin}
// 				End;          {Else-Begin}
// 		End;                  {If-(Stelle..)-Begin}
// 	End;                      {For-Num-Begin}

// {----------------------------------     Waagrecht suchen/Prioritt     ----}
// Stop:=false;
// For Zeile:=1 to 8 do
// 	Begin
// 	Stelle:=Pos (Wert,Waag[Zeile]);
// 	If (Stelle<>0) then
// 		Begin
// 		If (Setzen) then
// 			For J:=0 to (Length (Wert)-1) do
// 				If (Platz[Stelle+J,Zeile]='O')
// 				and (Platz[Stelle+J,Zeile-1]='O') then
// 					Stop:=true;
// 		If not (Stop) then
// 			If (Zahl<>0) then
// 				Begin
// 				Spalte:=Stelle+Zahl-1;
// 				Pri:=Dummy_1 (Wert,Pri);
// 				End
// 			Else
// 				For I:=0 to ((Length(Wert))-1) do
// 					If Wert[I]='O' then
// 						Begin
// 						Spalte:=Stelle+I-1;
// 						Pri:=Dummy_1 (Wert,Pri);
// 						End;
// 		End; {If-(Stelle..)-Begin}
// 	End;     {For-Zeile-Begin}

// {----------------------------------     Senkrecht suchen/Prioritt     ----}
// Stop:=false;
// For Spalte:=1 to 8 do
// 	Begin
// 	Stelle:=Pos (Wert,Senk[Spalte]);
// 	If (Stelle<>0) then
// 		Begin
// 		If Kontrolle then
// 			Pri:=Dummy_1 (Wert,Pri);
// 		End;
// 	End;     {For-Spalte-Begin}
// Prior:=Pri;
// End;                      {Function Prior}


// {--------------------------------------------------------------------------}
// {------------------     Warnung vor gefhrlichen Zgen     ----------------}
// {--------------------------------------------------------------------------}

// Function Warnung: Boolean;

// Begin
// Warnung:=false;
// If Kontrolle then
// If (Zeile<8) then
// 	Begin
// 	Inc (Zeile);
// 	AktString('S');
// 	Gewinnsuche('SSSS');
// 	If Spielende then
// 		Begin
// 		Spielende:=false;
// 		Gewinner:=Niemand;
// 		Warnung:=true;
// 		End; {If-Spielende-Begin}
// 	AktString('O');
// 	End; {If-(Zeile..)-Begin}
// End;     {Function Warnung}

// {--------------------------------------------------------------------------}
// {------------------     Zugauswertung                    ------------------}
// {--------------------------------------------------------------------------}

// Function Zugauswertung: Boolean;
// Var I,J: Integer;

// Begin
// Zugauswertung:=false;
// For I:=1 to (Length (Prior_1)-1) do
// 	Begin
// 	Val (Prior_1[I],Spalte,Code);
// 	For J:=(Length (Prior_2)-1) downto 1 do
// 		If (Prior_2[J]=Prior_1[I]) and not (Warnung) then
// 			If Kontrolle then
// 				Begin
// 				Zeichnen ('C',Farbe_Co);
// 				AktString('C');
// 				Zugauswertung:=true;
// 				Exit;
// 				End;  {If-Kontrolle-Begin}
// 	End;              {For-I-Begin}
// End;                  {Function Zugauswertung}

// {--------------------------------------------------------------------------}
// {------------------     Spielerzug     ------------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Spieler_Zug;

// Begin
// If Spielende then
// 	Exit;
// Wahl;                                {Spieler setzt}
// If Not Spielende then
// 	Begin
// 	Zeichnen('S',Farbe_Sp);          {Spielstein zeichnen + Zug speichern}
// 	AktString('S');                  {Aktualisieren der Spielfeld-Strings}
// 	Gewinnsuche('SSSS');             {Kontrolle auf Spielergewinn}
// 	End
// Else
// 	Exit;
// If Gewinner=Spieler then
// 	Begin
// 	Spielende:=true;
// 	Markierung(Farbe_Sp);
// 	End;
// Delay(500);
// End; {Procedure Spieler_Zug}

// {--------------------------------------------------------------------------}
// {------------------     Computerzug     -----------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Computer_Zug;

// Begin
// If Spielende then
// 	Exit;
// SetViewPort (0,Y(390),X(639),Y(450),true);
// ClearViewPort;
// SetColor (Blue);
// OutTextXY (X(10),TextHeight('Ip'),'Bitte etwas Geduld, ich muá nachdenken  ! ! !');

// {------------------     Auf Gewinn prfen     -----------------------------}

// For Spalte:=1 to 8 do
// 	Begin
// 	If Kontrolle then                      {8 Zge setzen}
// 		Begin
// 		AktString('C');
// 		Gewinnsuche('CCCC');
// 		If Spielende then                  {evtl. Gewinn}
// 			Begin
// 			Zeichnen('C',Farbe_Co);
// 			Markierung(Farbe_Co);
// 			Exit;                          {Verlassen von Computer-Zug}
// 			End  {If-Spielende-Begin}
// 		Else
// 			AktString('O');                {Zug wieder lschen}
// 		End;  {If-Kontrolle-Begin}
// 	End;      {For-Spalte-Begin}

// {------------------     Direkt-Gewinn-Verhinderung Gegner     -------------}

// For Spalte:=1 to 8 do
// 	Begin
// 	If Kontrolle then                      {8 Zge setzen}
// 		Begin
// 		AktString('S');
// 		Gewinnsuche('SSSS');
// 		If Spielende then                  {evtl. 'Feind'-gewinn}
// 			Begin
// 			AktString('C');
// 			Spielende:=false;
// 			Gewinner:=Niemand;
// 			Zeichnen('C',Farbe_Co);
// 			Exit;                          {Verlassen von Computer-Zug}
// 			End  {If-Spielende-Begin}
// 		Else
// 			AktString('O');                {Zug wieder lschen}
// 		End;  {If-Kontrolle-Begin}
// 	End;      {For-Spalte-Begin}

// {------------------     Suchen des besten Zuges     -----------------------}

// Prior_1:=Prior (Suchstring[3],' ',0,true);
// Prior_1:=Prior (Suchstring[4],Prior_1,0,true);
// Prior_1:=Prior (Suchstring[18],Prior_1,0,true);
// Prior_1:=Prior (Suchstring[19],Prior_1,0,true);
// Prior_2:=Prior (Suchstring[5],' ',2,true);
// Prior_2:=Prior (Suchstring[6],Prior_2,4,true);
// Prior_2:=Prior (Suchstring[17],Prior_2,2,true);
// Prior_2:=Prior (Suchstring[17],Prior_2,4,true);
// If (Zugauswertung) then
// 	Exit;

// Prior_2:=' ';
// For K:=7 to 12 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
// For K:=7 to 12 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
// If (Zugauswertung) then
// 	Exit;

// For K:=13 to 16 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
// For K:=13 to 16 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
// If (Zugauswertung) then
// 	Exit;

// Prior_2:='12345678 ';
// If Zugauswertung then
// 	Exit;

// Prior_1:='12345678 ';
// Prior_2:=Prior (Suchstring[5],' ',2,true);
// Prior_2:=Prior (Suchstring[6],Prior_2,4,true);
// Prior_2:=Prior (Suchstring[17],Prior_2,2,true);
// Prior_2:=Prior (Suchstring[17],Prior_2,4,true);

// If Zugauswertung then
// 	Exit;

// Prior_2:=' ';
// For K:=7 to 12 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
// For K:=7 to 12 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
// If Zugauswertung then
// 	Exit;

// Prior_2:=' ';
// For K:=13 to 16 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,true);
// For K:=13 to 16 do
// 	Prior_2:=Prior (Suchstring[K],Prior_2,0,false);
// If Zugauswertung then
// 	Exit;

// Spalte:=Last_2;
// If not (Warnung) then
// 	If (Kontrolle) then
// 		Begin
// 		Zeichnen ('C',Farbe_Co);
// 		AktString ('C');
// 		Exit;
// 		End;

// Spalte:=Last_1;
// If not (Warnung) then
// 	If (Kontrolle) then
// 		Begin
// 		Zeichnen ('C',Farbe_Co);
// 		AktString ('C');
// 		Exit;
// 		End;

// For Spalte:=1 to 8 do
// 	If not (Warnung) and (Kontrolle) then
// 		Begin
// 		Zeichnen ('C',Farbe_Co);
// 		AktString ('C');
// 		Exit;
// 		End;

// For Spalte:=1 to 8 do
// 	If (Kontrolle) then
// 		Begin
// 		Zeichnen ('C',Farbe_Co);
// 		AktString ('C');
// 		Exit;
// 		End;
// End; {Procedure Computer_Zug}

// {--------------------------------------------------------------------------}
// {------------------     Daten speichern     -------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Godat;
// Var I   :Byte;

// Begin
// Assign(Datja,'C:\TMP\TESTJA.DAT');
// Rewrite (Datja);
// Writeln(Datja,'nein');
// Close(Datja);

// Assign(Dat1,'C:\TMP\TEST.DAT');
// Rewrite (Dat1);
// For I:=1 to 8 do
// 	Writeln(Dat1,Waag[i]);
// For I:=1 to 8 do
// 	Writeln(Dat1,Senk[i]);
// For I:=1 to 9 do
// 	Writeln(Dat1,Reob[i]);
// For I:=1 to 9 do
// 	Writeln(Dat1,Liob[i]);
// Close(Dat1);

// Assign(Datja,'C:\TMP\TESTJA.DAT');
// Rewrite (Datja);
// Writeln(Datja,'ja');
// Close(Datja);
// End;  {Procedure Godat}

// {--------------------------------------------------------------------------}
// {------------------     Schluámeldung     ---------------------------------}
// {--------------------------------------------------------------------------}

// Procedure Schluss;
// Begin

// SetViewPort (0,Y(340)+TextHeight('I'),X(639),Y(479),true);
// ClearViewPort;
// Case Gewinner of
// 	Computer:      OutTextXY (10,Y(50),'tsch ,  ich  habe  gewonnen .');
// 	Spieler:       OutTextXY (10,Y(50),'Herzlichen  Glckwunsch ,  Sie  sind  besser ,  als  ich  dachte !');
// 	Niemand:       Begin
// 				   SetColor(Blue);
// 				   OutTextXY (10,Y(50),'Spiel  durch  "Abbruch"  beendet');
// 				   End;
// 	Unentschieden: Begin
// 				   SetColor (Blue);
// 				   OutTextXY (10,Y(50),'Das  Spiel  ist  unentschieden')
// 				   End;
// 	End;  {Case}
// End;      {Procedure Schluss}

// {--------------------------------------------------------------------------}
// {------------------     HAUPTPROGRAMM     ---------------------------------}
// {--------------------------------------------------------------------------}

// BEGIN                                  {Hauptprogramm}
// Grafik;                                {Grafik initialisieren}
// Titel;                                 {Titelbild}
// Neustart:                              {Neuanfang}
// Init;                                  {Einstellungen initialisieren}
// Spielregeln;                           {Erklrung der Spielregeln}
// Anfang;                                {Einstellung der Anfangsbedingungen}
// Grafik;
// Spielfeld;                             {Zeichnen des Spielfeldes}
// Textzeile(1);                          {Befehlszeile drucken}
// Godat;                                 {Zug auf Festplatte speichern}
// If Beginner then                       {TRUE: Spieler beginnt}
// 	Spieler_Zug                        {Wahl, Farbe, Zeichnen}
// Else
// 	Spalte:=4;                         {    erster     }
// Godat;
// Farbe:=Farbe_Co;                       {  Computerzug  }
// If Kontrolle then
// 	Begin                              {      ist      }
// 	Zeichnen('C',Farbe_Co);            {   definiert   }
// 	AktString('C');
// 	End;
// Godat;

// Repeat

// 	Spieler_Zug;
// 	Godat;
// 	Computer_Zug;
// 	Godat;

// Until Spielende;                       {max. 64 Zge}

// Schluss;

// Textzeile (3);
// Repeat
// 	Readln(Abfrage);
// Until (Abfrage='e') or (Abfrage='E') or (Abfrage='');
// If (Abfrage='') then
// 	Goto Neustart
// Else
// 	Begin
// 	RestoreCrtMode;
// 	Exit;
// 	End;

// END.                                   {Hauptprogramm}
