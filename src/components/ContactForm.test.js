import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';
import App from '../App';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<App/>)
    const header = screen.queryByText(/contact form/i);
    expect(header).toBeInTheDocument();
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const firstnameInput = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstnameInput, 'abcd');

    const errorMessage = await screen.findAllByTestId('error');
    expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(()=>{
        const error = screen.queryAllByTestId('error');
        expect(error).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);
    const firstnameInput = screen.getByLabelText(/first name/i);
    userEvent.type(firstnameInput, 'abcde');

    const lastnameInput = screen.getByLabelText(/last name/i);
    userEvent.type(lastnameInput, 'abc');

    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, ' ');

    await waitFor(()=>{
        const emailFeedback = screen.queryByText(/must be a valid email address/i);
        expect(emailFeedback).toBeInTheDocument();
    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput,'abc');

    await waitFor(()=>{
        const emailFeedback = screen.queryByText(/must be a valid email address/i);
        expect(emailFeedback).toBeInTheDocument();
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const lastnameInput = screen.getByLabelText(/last name/i);
    userEvent.type(lastnameInput, '')

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(()=>{
        const lastnameFeedback = screen.queryByText(/is a required field/i);
        expect(lastnameFeedback).toBeInTheDocument();
    })
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);
    
    const firstnameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstnameInput, 'huimin');

    const lastnameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastnameInput, 'zhang');

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'huiminzhang@email.com');
    
    const button = screen.getByRole('button');
    userEvent.click(button);
    await waitFor(()=>{
        const firstnameFeedback = screen.queryByText('huimin');
        const lastnameFeedback = screen.queryByText('zhang');
        const emailFeedback = screen.queryByText('huiminzhang@email.com');
        const messageDisplay = screen.queryByTestId('messageDisplay')
        expect(firstnameFeedback).toBeInTheDocument();
        expect(lastnameFeedback).toBeInTheDocument();
        expect(emailFeedback).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    })
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);
   
    const firstnameInput = screen.getByLabelText(/first name/i);
    userEvent.type(firstnameInput, 'abcde');

    const lastnameInput = screen.getByLabelText(/last name/i);
    userEvent.type(lastnameInput, 'abc');

    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, 'abcde.abc@email.com');

    const messageInput = screen.getByLabelText(/message/i)
    userEvent.type(messageInput, 'aaa');

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(()=>{
        const firstnameFeedback = screen.queryAllByTestId('firstnameDisplay');
        const lastnameFeedback = screen.queryAllByTestId("lastnameDisplay");
        const emailFeedback = screen.queryAllByTestId("emailDisplay");
        const messageFeedback = screen.queryAllByTestId("messageDisplay");

        expect(firstnameFeedback).toHaveLength(1);
        expect(lastnameFeedback).toHaveLength(1);
        expect(emailFeedback).toHaveLength(1);
        expect(messageFeedback).toHaveLength(1);
    })
});