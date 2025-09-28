import type { Route } from "../+types/root";
import { getMember } from "../data";
import { useNavigate, redirect, Form, } from "react-router";

import {
    EditMemberContainer,
    EditMemberTitle,
} from "../components";

import {
    StyledForm,
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

import { updateMember } from "../data";


export async function loader({ params }: Route.LoaderArgs) {
    const memberId = params.memberId;
    if (!memberId) {
        throw new Response("Member ID is required", { status: 400 });
    }

    const member = await getMember(memberId);
    if (!member) {
        throw new Response("Member not found", { status: 404 });
    }

    return { member };
}

// Action to update the member in the database
export async function action({ request, params }: Route.ActionArgs) {
    console.log("ACTION CALLED!");
    const formData = await request.formData();
    const rawData = Object.fromEntries(formData);
    
    // Convert the form data to proper types and handle empty strings
    const updatedMemberData: any = { ...rawData };
    
    // Convert empty strings to null for optional fields
    const optionalFields = ['avatar_url', 'email', 'date_of_birth'];
    optionalFields.forEach(field => {
        if (field in updatedMemberData && updatedMemberData[field] === '') {
            updatedMemberData[field] = null;
        }
    });
    
    console.log("Updated member data submitted:", updatedMemberData);
    
    // Ensure memberId is defined
    if (!params.memberId) {
        throw new Response("Member ID is required", { status: 400 });
    }
    
    // Here you would typically call an updateMember function to save changes to the database
    await updateMember(params.memberId, updatedMemberData);
    return redirect(`/members/${params.memberId}`); // Redirect back to the member's detail page
}


export default function EditMember({ loaderData }: Route.ComponentProps) {

    if (!loaderData) {
        throw new Response("Member not found", { status: 404 });
    }

    const data = loaderData as any;
    const { member, coupons = [] } = data;
    const navigate = useNavigate();

    return (
        <EditMemberContainer>
            <EditMemberTitle>Edit Member {member.first_name} {member.last_name}</EditMemberTitle>

                <StyledForm method="post">
                    <FormField>
                        <FormLabel htmlFor="avatar_url">Avatar URL</FormLabel>
                        <FormInput 
                            type="url" 
                            name="avatar_url" 
                            id="avatar_url"
                            defaultValue={member.avatar_url || ''}
                        />
                    </FormField>

                    <FormRow>
                        <FormGroup>
                            <FormField>
                                <FormLabel htmlFor="belt_rank">Belt Rank</FormLabel>
                                <FormSelect 
                                    name="belt_rank" 
                                    id="belt_rank" 
                                    required
                                    defaultValue={member.belt_rank}
                                >
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
                                    defaultValue={member.stripes || 0}
                                    name="stripes"
                                    id="stripes" 
                                    required
                                />
                            </FormField>
                        </FormGroup>
                    </FormRow>

                    <FormField>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <EmailInput 
                            name="email" 
                            id="email"
                            defaultValue={member.email || ''}
                        />
                    </FormField>

                    <FormField>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormInput 
                            type="date" 
                            name="date_of_birth" 
                            data-lpignore="true"
                            defaultValue={member.date_of_birth || ''}
                        />
                    </FormField>

                    <FormRow>
                        <FormGroup>
                            <FormField>
                                <FormLabel htmlFor="payment_status">Payment Status</FormLabel>
                                <FormSelect 
                                    name="payment_status" 
                                    id="payment_status" 
                                    required
                                    defaultValue={member.payment_status}
                                >
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                    <option value="trial">Trial</option>
                                </FormSelect>
                            </FormField>
                        </FormGroup>

                        <FormGroup>
                            <FormField>
                                <FormLabel>Payment Class</FormLabel>
                                <FormSelect 
                                    name="payment_class" 
                                    defaultValue={member.payment_class || "evenings"}
                                >
                                    <option value="evenings">Evenings</option>
                                    <option value="mornings">Mornings</option>
                                    <option value="both">Both</option>
                                    <option value="coupon">Coupon</option>
                                </FormSelect>
                            </FormField>
                        </FormGroup>
                    </FormRow>

                    <Actions>
                        <SubmitButton type="submit">Update member</SubmitButton>
                        <CancelButton type="button" onClick={() => navigate(-1)}>
                            Cancel
                        </CancelButton>
                    </Actions>
                </StyledForm>
        </EditMemberContainer>
    );
}