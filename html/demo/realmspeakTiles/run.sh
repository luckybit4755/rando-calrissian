#!/bin/bash	

export XML="MagicRealmData.xml"
export URL="https://raw.githubusercontent.com/dewkid/RealmSpeak/master/magic_realm/utility/components/resources/data/${XML}"

_run_main() {
	_run_setup || ${?}
	./realmspeakTiles.js ${XML} | tee realmspeakTiles.json | less 
}

_run_setup() {
	if [ -f ${XML} ] ; then
		echo ${XML} is go
	else
		echo downloading ${XML}
		curl ${URL} > ${XML} || return ${?}
		echo downloaded ${XML}
	fi

	if [ -d node_modules/xml2json ] ; then
		echo xml2json is local
	else
		echo installing xml2json
		npm install xml2json || return ${?}
		echo installed xml2json
	fi
}

_run_main ${*}
