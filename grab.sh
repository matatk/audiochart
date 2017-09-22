#!/bin/sh
PROG=`basename $0`
AC='audiochart.master'
LIB='lib'
COVERAGE='coverage'
EXAMPLES='examples'
EXAMPLES_DOCCO_FONTS='examples/hello/public'
ESLINTRC='.eslintrc.json'
DOC_ROOT='doc'

echo "Removing existing stuff..."
rm -rfv $LIB $COVERAGE $EXAMPLES $DOC_ROOT

if [ $PROG == 'grab.sh' ]; then
	echo
	echo "Checking out submodule..."
	git submodule init || exit 42
	git submodule update --remote || exit 42
	cd $AC || exit 42
	git checkout master || exit 42
	git reset --hard || exit 42
	cd - || exit 42
	echo
	echo "Building AudioChart..."
	cd $AC || exit 42
	git pull || exit 42
	npm install || exit 42
	npm run build || exit 42
	cd -
	echo
	echo "Coyping in needed things..."
	cp -Rv \
		"$AC/$LIB" \
		"$AC/$COVERAGE" \
		"$AC/$EXAMPLES" \
		"$AC/$DOC_ROOT" \
		. || exit 42
	echo
	echo "Removing some development/unused files..."
	rm -fv "$EXAMPLES/$ESLINTRC" || exit 42
	rm -rfv "$EXAMPLES_DOCCO_FONTS" || exit 42
	echo
	echo Updating index.md from README.md in master branch...
	git checkout master README.md || exit 42
	cp index.head.md index.md || exit 42
	cat README.md | tail -n +8 >> index.md || exit 42
	git rm --force README.md || exit 42
fi
