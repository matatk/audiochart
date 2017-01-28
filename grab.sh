#!/bin/sh
PROG=`basename $0`
AC='audiochart.master'
GRUNT='.grunt'
LIB='lib'
TEST='test'
EXAMPLES='examples'
ESLINTRC='.eslintrc.json'
DOC='doc/public'

echo "Removing existing stuff..."
rm -rfv $GRUNT $LIB $TEST $EXAMPLES $DOC

if [ $PROG == 'grab.sh' ]; then
	echo
	echo "Building AudioChart..."
	cd $AC || exit 42
	npm install || exit 42
	grunt || exit 42
	cd -
	echo
	echo "Coyping in needed things..."
	mkdir -pv "$DOC" || exit 42
	cp -R \
		"$AC/$GRUNT" \
		"$AC/$LIB" \
		"$AC/$TEST" \
		"$AC/$EXAMPLES" \
		"$AC/$DOC" \
		. || exit 42
	rm "$TEST/spec/$ESLINTRC" "$EXAMPLES/$ESLINTRC"
fi
