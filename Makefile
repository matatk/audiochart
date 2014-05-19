BUILD=build
TEST=test
SPECS=spec
SPECOUTPUT=$(TEST)/spec
AUDIOCHART=audiochart
WAAPI_EXTERNS=/usr/local/Cellar/closure-compiler/20130823/libexec/contrib/externs/w3c_audio.js
GCT_EXTERNS_PATH=https://raw.githubusercontent.com/vicb/VisuGps3/master/src/vgps3/plugins/chart/externs
GCT_EXTERNS=google_viz_api_v1.0.js

ifeq ($(OS),Windows_NT)
	RM := cmd /C del
	MKDIR := cmd /C md
	CP := # FIXME
else
	RM=rm -f
	RMDIR=rmdir
	MKDIR=mkdir -p
	CP=cp
endif

CURL=curl
COFFEE=coffee
JASMINE=jasmine-node
# Requires closure-compiler -- <https://developers.google.com/closure/compiler/> or from homebrew etc.
MINIFY=closure-compiler \
	--compilation_level ADVANCED_OPTIMIZATIONS \
	--externs $(WAAPI_EXTERNS) \
	--externs $(GCT_EXTERNS) \
	#--formatting PRETTY_PRINT

.PHONY: all specs test clean

all: \
	$(GCT_EXTERNS) \
	$(BUILD)/$(AUDIOCHART)-min.js \
	specs

$(GCT_EXTERNS):
	$(CURL) --remote-name $(GCT_EXTERNS_PATH)/$(GCT_EXTERNS)

$(BUILD)/$(AUDIOCHART).js: $(AUDIOCHART).coffee
	$(COFFEE) --output $(BUILD) --compile $<

$(BUILD)/$(AUDIOCHART)-min.js: $(BUILD)/$(AUDIOCHART).js
	$(MINIFY) --js $< > $@

specs:
	$(COFFEE) --output $(SPECOUTPUT) --compile $(SPECS)
	$(CP) $(SPECS)/*.fixtures.html $(SPECOUTPUT)/

test:
	$(JASMINE) --coffee --verbose $(SPECS)

clean:
	$(RM) \
		$(GCT_EXTERNS) \
		$(BUILD)/*.js \
		$(SPECOUTPUT)/*.spec.js \
		$(SPECOUTPUT)/*.fixtures.html
	$(RMDIR) $(BUILD) $(SPECOUTPUT)
