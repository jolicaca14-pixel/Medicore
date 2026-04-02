
import { UserRole } from '../types';
import { sanitizeInput, hasAdministrativeAccess, isSystemAdmin } from './security';

const testSecurityUtils = () => {
    console.log("--- Running Security Utility Tests ---");

    // 1. Test sanitizeInput
    console.log("Testing sanitizeInput...");
    const xssInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(xssInput);
    if (sanitized === 'scriptalert("xss")/script') {
        console.log("✅ sanitizeInput: Basic tags stripped");
    } else {
        console.error("❌ sanitizeInput: Failed. Got:", sanitized);
        process.exit(1);
    }

    if (sanitizeInput('<b>Hello</b>') === 'bHellob') {
        console.log("✅ sanitizeInput: Complex tags stripped");
    }

    // 2. Test RBAC Logic
    console.log("\nTesting RBAC Logic...");
    const adminRoles = [UserRole.ADMIN];
    const managerRoles = [UserRole.MANAGER];
    const accountantRoles = [UserRole.ACCOUNTANT];
    const professionalRoles = [UserRole.PROFESSIONAL];

    console.log("Admin has admin access:", hasAdministrativeAccess(adminRoles));
    console.log("Manager has admin access:", hasAdministrativeAccess(managerRoles));
    console.log("Accountant has admin access:", hasAdministrativeAccess(accountantRoles));
    console.log("Professional has admin access:", hasAdministrativeAccess(professionalRoles));

    console.log("Admin is system admin:", isSystemAdmin(adminRoles));
    console.log("Manager is system admin:", isSystemAdmin(managerRoles));

    const rbacPassed = hasAdministrativeAccess(adminRoles) &&
        hasAdministrativeAccess(managerRoles) &&
        hasAdministrativeAccess(accountantRoles) &&
        !hasAdministrativeAccess(professionalRoles) &&
        isSystemAdmin(adminRoles) &&
        !isSystemAdmin(managerRoles);

    if (rbacPassed) {
        console.log("✅ RBAC Logic Tests Passed!");
    } else {
        console.error("❌ RBAC Logic Tests Failed!");
        process.exit(1);
    }

    console.log("\n--- All Security Tests Passed! ---");
};

// Check if running directly via Node/tsx
if (import.meta.url.endsWith('utils/security.test.ts')) {
    testSecurityUtils();
}
