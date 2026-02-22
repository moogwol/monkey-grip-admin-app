import type { Route } from "./+types/_layout.members.$memberId.record-payment";
import { redirect } from "react-router";
import { createMemberPayment, getPaymentPlan, createCoupon } from "../data";

export async function action({ params, request }: Route.ActionArgs) {
    console.log('Recording payment for member ID:', params.memberId);

    const formData = await request.formData();
    const planIdValue = formData.get('membership_plan_id') as string;

    const memberId = params.memberId;
    if (!memberId) {
        throw new Response("Member ID is required", { status: 400 });
    }
    if (!planIdValue) {
        throw new Response("Membership plan is required", { status: 400 });
    }

    // Validate that the plan ID is a valid number
    const paymentPlan = await getPaymentPlan(planIdValue);
    if (!paymentPlan) {
        throw new Response("Invalid membership plan", { status: 400 });
    }



    const amountPaid = paymentPlan.price == null ? undefined : Number(paymentPlan.price);

    if (paymentPlan.is_coupon_plan) {
        console.log('Creating coupon for member ID:', memberId, 'with payment plan:', paymentPlan);
        await createCoupon({
            member_id: memberId,
            total_classes: 10, // Assuming a default of 10 classes for coupon plans
            classes_remaining: 10,
            amount_paid: amountPaid,
            expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Set expiry to 1 year from now
            notes: `Coupon created from payment plan ${paymentPlan.name}`,
            active: true
        });
    }

    await createMemberPayment(memberId, {
        membership_plan_id: Number(planIdValue)
    });

    return redirect(`/members/${memberId}`);
}