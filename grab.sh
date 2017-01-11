#!/bin/sh
PROG=`basename $0`
AC='audiochart'
GRUNT='.grunt'
LIB='lib'
TEST='test'

echo "Removing existing stuff..."
rm -rfv $GRUNT $LIB $TEST

if [ $PROG == 'grab.sh' ]; then
	echo
	echo "Building AudioChart..."
	cd $AC || exit 42
	npm install || exit 42
	grunt || exit 42
	cd -
	echo
	echo "Coyping in needed things..."
	cp -R "$AC/$GRUNT" "$AC/$LIB" "$AC/$TEST" .
fi
