'use strict';
(() => {
    const toDoList = {
        selector: null,
        id: null,
        form: null,
        containerSelector: null,
        container: null,
        init(selector, container) {
            if (typeof selector === "string" || selector.trim() !== '') this.selector = selector;
            if (typeof container === 'string' || container.trim() !== '') this.containerSelector = container;
            if (localStorage.getItem(this.selector) && JSON.parse(localStorage.getItem(this.selector)).length) {
                const tempData = JSON.parse(localStorage.getItem(this.selector));
                this.id = tempData[tempData.length - 1].id;
            }
            this.getForm();
            this.getHTMLElement();
            this.deleteItem();
        },
        getForm() {
            const formElement = document.querySelector(this.selector);
            this.form = formElement;
            formElement.addEventListener('submit', event => {
                event.preventDefault();
                event.stopPropagation();
                const data = {};
                formElement.querySelectorAll('input, textarea').forEach((item) => {
                    data[item.name] = item.value;
                })
                data.id = ++this.id;
                const savedData = this.saveData(data);
                this.renderItem(savedData);
            })
        },
        getHTMLElement() {
            this.container = document.querySelector(this.containerSelector);
            document.addEventListener('DOMContentLoaded', event => {
                event.preventDefault();
                event.stopPropagation();
                const toDo = JSON.parse(localStorage.getItem(this.selector));
                if (!toDo) return 'localStorage is empty';
                toDo.map(todoItem => {
                    this.renderItem(todoItem);
                })
            })
        },
        saveData(data) {
            let dataFromStore = localStorage.getItem(this.selector);
            if (!dataFromStore) {
                const array = [];
                array.push(data);
                localStorage.setItem(this.selector, JSON.stringify(array));
            }
            if (dataFromStore) {
                dataFromStore = JSON.parse(dataFromStore);
                dataFromStore.push(data);
                localStorage.setItem(this.selector, JSON.stringify(dataFromStore));
            }
            return data;
        },
        renderItem(data) {
            const title = data.title;
            const description = data.description;
            const wrapper = document.createElement('div');
            wrapper.classList.add('col-4');
            wrapper.setAttribute('data-id', data.id);
            wrapper.innerHTML = `<div class="taskWrapper">
                            <div class="taskHeading">${title}</div>
                            <div class="taskDescription">${description}</div>
                         </div>`;
            this.container.appendChild(wrapper);
        },
        deleteItem() {
            this.container.addEventListener('click', evt => {
                evt.stopPropagation();
                const currentItem = evt.target.closest('[data-id]');
                if (currentItem === null) return;
                const currentItemId = +currentItem.getAttribute('data-id');
                const filteredData = JSON.parse(localStorage.getItem(this.selector)).filter(item => item.id !== currentItemId);
                localStorage.setItem(this.selector, JSON.stringify(filteredData));
                currentItem.remove();
            });
        },
    }
    toDoList.init('#todoForm', '#todoItems');
})()