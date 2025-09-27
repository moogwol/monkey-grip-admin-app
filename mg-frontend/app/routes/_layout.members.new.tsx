import { Form, redirect, useNavigate } from "react-router";
import type { Route } from "../+types/root";

import { createMember } from "../data";

import {
    NewMemberForm,
    FormRow,
    FormGroup,
    FormField,
    FormLabel,
    FormInput,
    FormSelect,
    Actions,
    SubmitButton,
    CancelButton,
    FormNumberInput,
    EmailInput,
} from "../components";

// Action to submit new member to the database
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const newMemberData = Object.fromEntries(formData);
    console.log("New member data submitted:", newMemberData);
    const createdMember = await createMember(newMemberData);
    return redirect(`/members/${createdMember.id}`); // Redirect to the new member's detail page
}

export default function NewMember() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>New Member</h2>
            <p>This is the page to add a new member. Implement the form here.</p>
            <NewMemberForm method="post">
                <FormField>
                    <FormLabel htmlFor="first_name">First Name</FormLabel>
                    <FormInput type="text" name="first_name" id="first_name" required />
                </FormField>

                <FormField>
                    <FormLabel htmlFor="last_name">Last Name</FormLabel>
                    <FormInput type="text" name="last_name" id="last_name" required />
                </FormField>

                <FormField>
                    <FormLabel htmlFor="avatar_url">Avatar URL</FormLabel>
                    <FormInput type="url" name="avatar_url" id="avatar_url" required />
                </FormField>

                <FormRow>
                    <FormGroup>
                        <FormField>
                            <FormLabel htmlFor="belt_rank">Belt Rank</FormLabel>
                            <FormSelect name="belt_rank" id="belt_rank" required>
                                <option value="white">White</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="brown">Brown</option>
                                <option value="black">Black</option>
                            </FormSelect>
                        </FormField>
                    </FormGroup>

                    <FormGroup>
                        <FormField>
                            <FormLabel htmlFor="stripes">Stripes</FormLabel>
                            <FormNumberInput
                                type="number"
                                min="0"
                                max="4"
                                step="1"
                                defaultValue="0"
                                name="stripes"
                                id="stripes" required
                            />
                        </FormField>
                    </FormGroup>
                </FormRow>

                <FormField>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <EmailInput name="email" id="email" required />
                </FormField>

                <FormField>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormInput type="date" name="date_of_birth" />
                </FormField>

                <FormRow>
                    <FormGroup>
                        <FormField>
                            <FormLabel htmlFor="payment_status">Payment Status</FormLabel>
                            <FormSelect name="payment_status" id="payment_status" required>
                                <option value="paid">Paid</option>
                                <option value="overdue">Overdue</option>
                                <option value="trial">Trial</option>
                            </FormSelect>
                        </FormField>
                    </FormGroup>

                    <FormGroup>
                        <FormField>
                            <FormLabel>Payment Class</FormLabel>
                            <FormSelect name="payment_class" defaultValue="evenings">
                                <option value="evenings">Evenings</option>
                                <option value="mornings">Mornings</option>
                                <option value="both">Both</option>
                                <option value="coupon">Coupon</option>
                            </FormSelect>
                        </FormField>
                    </FormGroup>
                </FormRow>

                    <Actions>
                        <SubmitButton type="submit">Create Member</SubmitButton>
                        <CancelButton type="button" onClick={() => navigate(-1)}>
                            Cancel
                        </CancelButton>
                    </Actions>

            </NewMemberForm>
        </div>
    );

}