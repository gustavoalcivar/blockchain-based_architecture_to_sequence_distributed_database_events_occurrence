const protobuf = require('protobufjs')
const protoJson = require('./protos.json')

const root = protobuf.Root.fromJSON(protoJson)

const ClientEventsSubscribeResponse = root.lookup('ClientEventsSubscribeResponse')
const ClientEventsSubscribeRequest = root.lookup('ClientEventsSubscribeRequest')
const ClientEventsUnsubscribeResponse = root.lookup('ClientEventsUnsubscribeResponse')
const ClientEventsUnsubscribeRequest = root.lookup('ClientEventsUnsubscribeRequest')
const EventSubscription = root.lookup('EventSubscription')
const EventFilter = root.lookup('EventFilter')
const FilterType = root.lookup('FilterType')
const Message = root.lookup('Message')
const Event = root.lookup('Event')
const EventList = root.lookup('EventList')
const StateChangeList = root.lookup('StateChangeList')

function encodeValidatorMessage (messageType, correlationId, content) {
	return Message.encode({messageType, correlationId, content}).finish()
}

function encodeSubscribeRequest (subscriptions, lastKnownBlockIds) {
	return ClientEventsSubscribeRequest.encode({subscriptions, lastKnownBlockIds}).finish()
}

function encodeUnsubscribeRequest () {
	return ClientEventsUnsubscribeRequest.encode({}).finish()
}

function encodeSubscription (eventType, filters) {
	return EventSubscription.fromObject({eventType, filters})
}

function encodeFilter (key, matchString, filterType) {
	return EventFilter.fromObject({key, matchString, filterType})
}

function decodeValidatorMessage (message) {
	return Message.decode(message)
}

function decodeSubscribeResponse (response) {
	return ClientEventsSubscribeResponse.decode(response)
}

function decodeUnsubscribeResponse (response) {
	return ClientEventsUnsubscribeResponse.decode(response)
}

function decodeEventsList (eventListEncoded) {
	return EventList.decode(eventListEncoded)
}

function decodeEvent (eventEncoded) {
	return Event.decode(eventEncoded)
}

function decodeStateChangeList (stateElementEncoded) {
	return StateChangeList.decode(stateElementEncoded)
}

module.exports = {
	encodeValidatorMessage,
	encodeSubscription,
	encodeSubscribeRequest,
	encodeUnsubscribeRequest,
	encodeFilter,

	decodeValidatorMessage,
	decodeSubscribeResponse,
	decodeUnsubscribeResponse,
	decodeEventsList,
	decodeEvent,
	decodeStateChangeList
}