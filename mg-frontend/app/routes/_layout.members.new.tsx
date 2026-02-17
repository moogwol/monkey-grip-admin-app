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

    // Extract image file before converting to object
    const profileImageFile = formData.get('profileImage') as File | null;

    // Create member data object for all fields except the image
    const rawData = Object.fromEntries(
        Array.from(formData.entries()).filter(([key]) => key !== 'profileImage')
    );
    
    // Convert empty strings to null for optional fields (email validation fails on empty string)
    const newMemberData: any = { ...rawData };
    const optionalFields = ['email', 'phone', 'date_of_birth'];
    optionalFields.forEach(field => {
        if (field in newMemberData && newMemberData[field] === '') {
            delete newMemberData[field];
        }
    });

    // Create the member
    const createdMember = await createMember(newMemberData);

    // Upload the image if provided
    if (profileImageFile && profileImageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('profileImage', profileImageFile);

        try {
            const env = (import.meta as any).env || {};
            let apiUrl = env.VITE_API_URL || (env.DEV ? '/api' : 'http://mg-api:3000/api');
            if (apiUrl.startsWith('/')) {
                const origin = new URL(request.url).origin;
                apiUrl = `${origin}${apiUrl}`;
            }

            const incomingCookie = request.headers.get('cookie');
            const uploadResponse = await fetch(
                `${apiUrl}/images/members/${createdMember.id}/profile-image`,
                {
                    method: 'POST',
                    headers: incomingCookie ? { cookie: incomingCookie } : undefined,
                    body: imageFormData
                }
            );

            if (!uploadResponse.ok) {
                console.warn('Image upload failed:', await uploadResponse.text());
            }
        } catch (error) {
            console.warn('Error uploading image:', error);
        }
    }

    return redirect(`/members/${createdMember.id}`); // Redirect to the new member's detail page
}

export default function NewMember() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>New Member</h2>
            <p>This is the page to add a new member. Implement the form here.</p>
            <NewMemberForm method="post" encType="multipart/form-data">
                <FormField>
                    <FormLabel htmlFor="first_name">First Name</FormLabel>
                    <FormInput type="text" name="first_name" id="first_name" required />
                </FormField>

                <FormField>
                    <FormLabel htmlFor="last_name">Last Name</FormLabel>
                    <FormInput type="text" name="last_name" id="last_name" required />
                </FormField>

                <FormField>
                    <FormLabel htmlFor="avatar_url">Choose Image</FormLabel>
                    <FormInput type="file" name="profileImage" id="avatar_url" />
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
                    <EmailInput name="email" id="email" />
                </FormField>

                <FormField>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormInput type="date" name="date_of_birth" data-lpignore="true" />
                </FormField>

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