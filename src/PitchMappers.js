/**
 * Base Pitch Mapper
 * @private
 * @abstract
 */
class PitchMapper {
	/**
	 * Create a base Pitch Mapper
	 * @param {Object[]} seriesInfo - min and max data and frequencies
	 * @param {string} seriesInfo[].minimumDatum - minimun data value
	 * @param {string} seriesInfo[].maximumDatum - maximun data value
	 * @param {string} seriesInfo[].minimumFrequency - minimun frequency
	 * @param {string} seriesInfo[].maximumFrequency - maximun frequency
	 */
	constructor(seriesInfo) {
		// Store the info for all series
		this._minimumDatum = []
		this._maximumDatum = []
		this._minimumFrequency = []
		this._maximumFrequency = []
		this._dataRange = []
		this._frequencyRange = []

		seriesInfo.forEach((series, index) => {
			if (series.maximumDatum < series.minimumDatum) {
				throw Error('minimum datum should be <= maximum datum')
			}

			if (series.maximumFrequency < series.minimumFrequency) {
				throw Error('minimum frequency should be <= maximum frequency')
			}

			this._minimumDatum[index] = series.minimumDatum
			this._maximumDatum[index] = series.maximumDatum
			this._minimumFrequency[index] = series.minimumFrequency
			this._maximumFrequency[index] = series.maximumFrequency

			// Pre-calculate for performance (I expect) when mapping
			this._dataRange[index] =
				this._maximumDatum[index] - this._minimumDatum[index]
			this._frequencyRange[index] =
				this._maximumFrequency[index] - this._minimumFrequency[index]
		})
	}

	/**
	 * Map a datum to an output value
	 * @param {number} datum - the datum to be mapped
	 * @abstract
	 */
	map(datum) {
		throw Error('Base map() must be overriden.')
	}
}


/**
 * Maps each datum to a corresponding frequency.
 * @private
 * @extends {PitchMapper}
 */
class FrequencyPitchMapper extends PitchMapper {
	// TODO: dupe docs for now: https://github.com/jsdoc3/jsdoc/issues/1012
	/**
	 * Create a Frequency Pitch Mapper
	 * @param {Object[]} seriesInfo - minimum and maximums for each series
	 * @param {string} seriesInfo[].minimumDatum - minimun data value
	 * @param {string} seriesInfo[].maximumDatum - maximun data value
	 * @param {string} seriesInfo[].minimumFrequency - minimun frequency
	 * @param {string} seriesInfo[].maximumFrequency - maximun frequency
	 */
	constructor(seriesInfo) {
		super(seriesInfo)
	}

	/**
	 * Given a datum value, compute the corresponding frequency
	 * @param {number} series - map on which series?
	 * @param {number} datum - the datum to be mapped
	 * @returns {number} frequency for this datum
	 */
	map(series, datum) {
		let ratio
		if (this._dataRange[series]) {
			ratio = (datum - this._minimumDatum[series])
				/ this._dataRange[series]
		} else {
			ratio = 0.5
		}
		return this._minimumFrequency[series]
			+ (ratio * this._frequencyRange[series])
	}
}
