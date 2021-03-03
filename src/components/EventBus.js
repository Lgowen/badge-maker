import Vue from 'vue'

export const EventBus = new Vue()
export const Events = {
    ALERT: 'ALERT',
    RESTART: 'RESTART',
    MESSAGE: 'MESSAGE',
    JOBNUMBER: 'JOBNUMBER'
}