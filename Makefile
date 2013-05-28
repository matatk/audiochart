BUILD=build
TEST=test
SPECS=spec
SPECOUTPUT=$(TEST)/spec
AUDIOCHART=audiochart
GCT_EXTERNS=google_viz_api_v1.0.js

RM=rm -f
RMDIR=rmdir
MKDIR=mkdir -p
CURL=curl
COFFEE=coffee
JASMINE=jasmine-node
# Requires closure-compiler -- <https://developers.google.com/closure/compiler/> or from homebrew etc.
MINIFY=closure-compiler \
	--compilation_level=ADVANCED_OPTIMIZATIONS\
	--externs /usr/local/Cellar/closure-compiler/20130411/libexec/contrib/externs/w3c_audio.js \
	--externs $(GCT_EXTERNS)

.PHONY: all specs test clean

all: \
	$(GCT_EXTERNS) \
	$(BUILD)/$(AUDIOCHART)-min.js \
	specs

$(GCT_EXTERNS):
	$(CURL) --remote-name https://raw.github.com/vicb/VisuGps3/master/src/vgps3/plugins/chart/externs/$(GCT_EXTERNS)

$(BUILD)/$(AUDIOCHART).js: $(AUDIOCHART).coffee
	$(COFFEE) --output $(BUILD) --compile $<

$(BUILD)/$(AUDIOCHART)-min.js: $(BUILD)/$(AUDIOCHART).js
	$(MINIFY) --js $< > $@

specs:
	$(COFFEE) --output $(SPECOUTPUT) --compile $(SPECS)

test:
	$(JASMINE) --coffee --verbose $(SPECS)

clean:
	$(RM) \
		$(GCT_EXTERNS) \
		$(BUILD)/*.js \
		$(SPECOUTPUT)/*.spec.js
	$(RMDIR) $(BUILD) $(SPECOUTPUT)
