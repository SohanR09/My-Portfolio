import { createServerSupabaseClient } from "./server"

export async function seedAdminUser() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if the user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers({
      filter: {
        email: "sohan1203@gmail.com",
      },
    })

    if (existingUser && existingUser.users.length > 0) {
      console.log("Admin user already exists")
      return { success: true, message: "Admin user already exists" }
    }

    // Create the admin user
    const { error } = await supabase.auth.admin.createUser({
      email: "sohan1203@gmail.com",
      password: "sohan",
      email_confirm: true,
    })

    if (error) {
      console.error("Error creating admin user:", error)
      return { success: false, error: error.message }
    }

    return { success: true, message: "Admin user created successfully" }
  } catch (error: any) {
    console.error("Error seeding admin user:", error)
    return { success: false, error: error.message }
  }
}

