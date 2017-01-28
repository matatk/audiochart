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
	if [ ! -f "$AC/package.json" ]; then
		echo
		echo "Checking out submodule..."
		git submodule init || exit 42
		git submodule update --remote || exit 42
		cd $AC || exit 42
		git checkout master || exit 42
		cd - || exit 42
	fi
	echo
	echo "Building AudioChart..."
	cd $AC || exit 42
	git pull || exit 42
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
	cat README.md | tail -n +8 >> index.md || exit 42
	git rm --force README.md || exit 42
fi
