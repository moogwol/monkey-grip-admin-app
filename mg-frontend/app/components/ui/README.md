# UI Components Directory Structure

This directory contains all UI components organized by functionality for better maintainability and developer experience.

## 📁 Directory Organization

### `/form/` - Form Components
Contains all form-related components split by functionality:
- **FormContainer.tsx** - Main form container and sections
- **FormContainers.tsx** - Page-specific containers (EditMember, NewMember)
- **FormLayout.tsx** - Field containers, rows, groups, and labels
- **FormInputs.tsx** - All input types (text, email, select, number, textarea)
- **FormButtons.tsx** - Button variants (submit, cancel, secondary)
- **FormActions.tsx** - Button containers and action layouts
- **FormFeedback.tsx** - Error messages and helper text

### `/member/` - Member Components  
Contains all member-related display components:
- **MemberProfile.tsx** - Main profile containers and headers
- **MemberBanner.tsx** - Banner layout, avatar, and member info
- **MemberDetails.tsx** - Details display, belt info, payment status
- **MemberCoupons.tsx** - Coupon sections, lists, and progress bars
- **MemberActions.tsx** - Action button containers

### `/navigation/` - Navigation Components
Contains all navigation-related components:
- **Sidebar.tsx** - Main sidebar container
- **SidebarTitle.tsx** - Sidebar title styling
- **SidebarControls.tsx** - Sidebar control elements
- **StyledNav.tsx** - Navigation wrapper styling
- **StyledNavLink.tsx** - Styled navigation links

### Individual Components
- **BeltGraphic.tsx** - Specialized belt visualization component
- **SearchSpinner.tsx** - Loading spinner for search functionality

## 🎯 Benefits of This Structure

### **Developer Experience**
- **Easy to find** - Components grouped by domain/functionality
- **Better IDE support** - File search, go-to-definition works perfectly
- **Cleaner git history** - Changes to one component don't affect others
- **Focused code reviews** - Reviewers can focus on individual components

### **Maintainability**
- **Single responsibility** - Each file has one clear purpose
- **Easier testing** - Can test components in isolation
- **Better tree shaking** - Bundlers can optimize unused components
- **No merge conflicts** - Multiple developers can work safely

### **Scalability**
- **Easy to add new components** - Just create a new file
- **Clear domain boundaries** - Form vs Member vs Navigation
- **Future-ready** - Easy to extract to separate packages if needed

## 📦 Import Examples

```tsx
// Import specific components
import { FormInput, SubmitButton } from '../components/ui/form';
import { MemberProfile, MemberBanner } from '../components/ui/member';
import { Sidebar, StyledNavLink } from '../components/ui/navigation';

// Import everything from a domain
import * as Form from '../components/ui/form';
import * as Member from '../components/ui/member';

// Import through main UI export (all components available)
import { FormInput, MemberProfile, Sidebar } from '../components/ui';
```

## 🔄 Migration Notes

All existing imports continue to work unchanged thanks to the index.ts re-exports. The refactor is completely backward compatible.

Legacy components (like `NewMemberForm`, `Actions`) are preserved for compatibility but marked for future migration to the generic form components.