#!/bin/sh
PROG=`basename $0`
AC='audiochart.master'
GRUNT='.grunt'
LIB='lib'
TEST='test'
EXAMPLES='examples'
ESLINTRC='.eslintrc.json'
DOC_ROOT='doc'

echo "Removing existing stuff..."
rm -rfv $GRUNT $LIB $TEST $EXAMPLES $DOC_ROOT

if [ $PROG == 'grab.sh' ]; then
	echo
	echo "Building AudioChart..."
	cd $AC || exit 42
	npm install || exit 42
	grunt || exit 42
	cd -
	echo
	echo "Coyping in needed things..."
	cp -R \
		"$AC/$GRUNT" \
		"$AC/$LIB" \
		"$AC/$TEST" \
		"$AC/$EXAMPLES" \
		"$AC/$DOC_ROOT" \
		. || exit 42
	rm "$TEST/spec/$ESLINTRC" "$EXAMPLES/$ESLINTRC"
	echo
	echo Updating index.md from README.md in master branch...
	git checkout master README.md || exit 42
	cp index.head.md index.md || exit 42
	cat README.md | tail -n +6 >> index.md || exit 42
	git rm --force README.md || exit 42
	git add index.md || exit 42
fi
