# **App Name**: MaterialFlow

## Core Features:

- Inbound Order Display: Display a list of 'IN' vehicles/orders with key details. Each entry represents an order awaiting processing.
- New Order UI: Implement a 'New Order' button (+) that opens a modal for order creation.
- Order Input Modal: Modal input for capturing order details, pre-filled serial number with increment, optional fields for vehicle number, party name, reference number, etc.
- Outbound Order Processing: Enable marking orders as 'OUT' at the billing counter and moving them to an 'OUT' state list.
- In Time Alert Setting: Settings page allowing configuration of maximum 'IN' state time with visual highlighting (alerting).
- Counter Reset Setting: Configuration for counter reset time (daily, weekly, monthly, yearly, custom).

## Style Guidelines:

- Primary color: Soft blue (#7FB7BE) to convey trust, calmness, and efficiency, fitting for the app's logistical purpose.
- Background color: Light, desaturated blue (#E8F1F2). This provides a clean and unobtrusive backdrop that complements the primary color and keeps attention on the content.
- Accent color: Orange (#F2B33D). This contrasts against the soft blue, drawing attention to key interactive elements, alerts, and calls to action.
- Body and headline font: 'Inter' sans-serif for its modern, machined, objective, neutral, readable appearance on screens.
- Simple, clear, and functional icons to represent order status (IN/OUT) and other actions.
- Responsive layout design that adapts to mobile and tablet screens, focusing on clear list views and modal overlays.
- Subtle transitions and animations to indicate state changes (e.g., moving an order from IN to OUT).