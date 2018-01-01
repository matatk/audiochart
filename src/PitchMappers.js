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
		const series = seriesInfo[0]

		if (series.maximumDatum < series.minimumDatum) {
			throw Error('minimum datum should be <= maximum datum')
		}

		if (series.maximumFrequency < series.minimumFrequency) {
			throw Error('minimum frequency should be <= maximum frequency')
		}

		this._minimumDatum = series.minimumDatum
		this._maximumDatum = series.maximumDatum
		this._minimumFrequency = series.minimumFrequency
		this._maximumFrequency = series.maximumFrequency
		this._dataRange = this._maximumDatum - this._minimumDatum
		this._frequencyRange = this._maximumFrequency - this._minimumFrequency
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
		if (this._dataRange) {
			ratio = (datum - this._minimumDatum) / this._dataRange
		} else {
			ratio = 0.5
		}
		return this._minimumFrequency + (ratio * this._frequencyRange)
	}
}
