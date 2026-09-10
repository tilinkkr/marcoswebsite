import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { CheckoutFlow } from "./CheckoutFlow";

describe("CheckoutFlow", () => {
  it("renders the server-aligned membership price and keeps QR hidden before consent", () => {
    render(<CheckoutFlow productKind="membership" qrAsset="/missing.png" />);
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.queryByAltText(/payment qr/i)).not.toBeInTheDocument();
  });

  it("requires every consent and an exact typed name", async () => {
    const user = userEvent.setup();
    render(<CheckoutFlow productKind="membership" qrAsset="/missing.png" />);
    await user.type(screen.getByLabelText("Full legal name"), "Alex Morgan");
    await user.type(screen.getByLabelText("Email address"), "alex@example.com");
    await user.type(screen.getByLabelText("Mobile number"), "+15555550123");
    await user.type(screen.getByLabelText("Country"), "United States");
    await user.click(screen.getByRole("button", { name: /continue to risk/i }));

    const accept = screen.getByRole("button", { name: /accept & continue/i });
    expect(accept).toBeDisabled();
    for (const checkbox of screen.getAllByRole("checkbox")) fireEvent.click(checkbox);
    await user.type(screen.getByLabelText("Type your full legal name"), "Alex Morgan");
    expect(accept).toBeEnabled();
    expect(screen.queryByAltText(/payment qr/i)).not.toBeInTheDocument();
  });

  it("renders the indicator price from shared configuration", () => {
    render(<CheckoutFlow productKind="indicator" qrAsset="/missing.png" />);
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("MARCOS ONE")).toBeInTheDocument();
  });
});
