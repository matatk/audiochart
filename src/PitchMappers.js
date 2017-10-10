'use strict'
/**
 * @private
 * @param {number} minimumDatum - the minimum value in this data series
 * @param {number} maximumDatum - the maximum value in this data series
 */
class PitchMapper {
	constructor(minimumDatum, maximumDatum) {
		this.minimumDatum = minimumDatum
		this.maximumDatum = maximumDatum
		if (this.minimumDatum > this.maximumDatum) {
			throw Error('minimum datum should be <= maximum datum')
		}
	}

	/**
	 * Map a datum to an output value
	 * @abstract
	 * @param {number} datum - the datum to be mapped
	 */
	map(datum) {}  // FIXME naming conflict?
}


/**
 * @private
 * @extends {PitchMapper}
 * @param {number} minimumDatum - the minimum value in this data series
 * @param {number} maximumDatum - the maximum value in this data series
 * @param {number} minimumFrequency - the minimum output frequency
 * @param {number} maximumFrequency - the maximum output frequency
 */
class FrequencyPitchMapper extends PitchMapper {
	constructor(minimumDatum, maximumDatum, minimumFrequency, maximumFrequency) {
		super(minimumDatum, maximumDatum)
		this.minimumFrequency = minimumFrequency
		this.maximumFrequency = maximumFrequency
		if (this.minimumFrequency > this.maximumFrequency) {
			throw Error('minimum frequency should be <= maximum frequency')
		}
		this.dataRange = this.maximumDatum - this.minimumDatum
	}

	/**
	 * @param {number} datum - the datum to be mapped
	 * @returns {number} frequency for this datum
	 */
	map(datum) {
		let ratio
		if (this.dataRange) {
			ratio = (datum - this.minimumDatum) / this.dataRange
		} else {
			ratio = 0.5
		}
		return this.minimumFrequency + ratio * (this.maximumFrequency - this.minimumFrequency)
	}
}
