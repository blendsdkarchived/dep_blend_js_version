curdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
ln -s $curdir/../../blend-class-system/lib/Blend.js $curdir/../src/js/core/Blend.js
ln -s $curdir/../../blend-class-system/lib/ClassBuilder.js $curdir/../src/js/core/ClassBuilder.js
ln -s $curdir/../bin/builder/src/Builder/utils/String.js $curdir/../src/js/utils/String.js