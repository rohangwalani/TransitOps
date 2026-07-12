package com.transitops.config;

import com.transitops.entity.Driver;
import com.transitops.entity.User;
import com.transitops.enums.DriverStatus;
import com.transitops.enums.RoleType;
import com.transitops.repository.DriverRepository;
import com.transitops.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(DriverRepository driverRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Users
        System.out.println("Checking users seeding status...");
        
        if (!userRepository.existsByEmail("yash.hirwani@transitops.io")) {
            System.out.println("Seeding database with default user Yash Hirwani...");
            Set<RoleType> yashRoles = new HashSet<>();
            yashRoles.add(RoleType.ROLE_FLEET_MANAGER);
            
            User yash = User.builder()
                    .name("Yash Hirwani")
                    .email("yash.hirwani@transitops.io")
                    .password(passwordEncoder.encode("password"))
                    .phone("+1 (555) 902-3482")
                    .roles(yashRoles)
                    .enabled(true)
                    .build();
            userRepository.save(yash);
            System.out.println("Yash Hirwani user seeded.");
        }

        if (!userRepository.existsByEmail("admin@transitops.io")) {
            System.out.println("Seeding database with default admin user...");
            Set<RoleType> adminRoles = new HashSet<>();
            adminRoles.add(RoleType.ROLE_ADMIN);
            adminRoles.add(RoleType.ROLE_FLEET_MANAGER);
            
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@transitops.io")
                    .password(passwordEncoder.encode("password"))
                    .phone("+1 (555) 902-1234")
                    .roles(adminRoles)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user seeded.");
        }

        // Seed Drivers
        if (driverRepository.count() < 10) {
            System.out.println("Seeding database with mock drivers for pagination testing...");
            List<Driver> mockDrivers = new ArrayList<>();

            String[] names = {
                "Alex Sterling", "Sarah Jenkins", "Michael Chang", "Marcus Vance",
                "Elena Rostova", "David Koomson", "Aria Patel", "Liam O'Connor",
                "Emma Watson", "Oliver Bennett", "Sophia Reed", "James Davidson",
                "Isabella Rossi", "Lucas Silva", "Mia Tanaka", "Noah Fischer",
                "Charlotte Dubois", "Ethan Hunt", "Amara Diallo", "Mateo Fernandez",
                "Zoe Washburne", "Malcolm Reynolds", "Kaylee Frye", "Hoban Washburne",
                "Inara Serra", "Jayne Cobb", "Simon Tam", "River Tam"
            };

            DriverStatus[] statuses = {
                DriverStatus.AVAILABLE, DriverStatus.ON_TRIP, DriverStatus.OFF_DUTY, DriverStatus.AVAILABLE,
                DriverStatus.AVAILABLE, DriverStatus.SUSPENDED, DriverStatus.AVAILABLE, DriverStatus.ON_TRIP,
                DriverStatus.AVAILABLE, DriverStatus.OFF_DUTY, DriverStatus.AVAILABLE, DriverStatus.AVAILABLE,
                DriverStatus.AVAILABLE, DriverStatus.ON_TRIP, DriverStatus.AVAILABLE, DriverStatus.AVAILABLE,
                DriverStatus.AVAILABLE, DriverStatus.OFF_DUTY, DriverStatus.AVAILABLE, DriverStatus.AVAILABLE,
                DriverStatus.AVAILABLE, DriverStatus.ON_TRIP, DriverStatus.AVAILABLE, DriverStatus.AVAILABLE,
                DriverStatus.AVAILABLE, DriverStatus.SUSPENDED, DriverStatus.AVAILABLE, DriverStatus.OFF_DUTY
            };

            int[] safetyScores = {
                95, 88, 92, 79, 97, 65, 94, 89, 91, 85, 96, 90, 87, 82, 93, 86, 94, 80, 98, 88, 95, 84, 99, 92, 96, 60, 95, 99
            };

            for (int i = 0; i < names.length; i++) {
                String emailName = names[i].toLowerCase().replace(" ", ".").replace("'", "");
                mockDrivers.add(Driver.builder()
                        .name(names[i])
                        .licenseNumber("LIC-" + (882100 + i))
                        .licenseCategory(i % 3 == 0 ? "Class A CDL" : i % 3 == 1 ? "Class B CDL" : "Standard")
                        .licenseExpiryDate(LocalDate.now().plusMonths(3 + (i * 2)))
                        .contactNumber("+1 (555) 902-34" + (10 + i))
                        .email(emailName + "@transitops.io")
                        .status(statuses[i])
                        .safetyScore(safetyScores[i])
                        .totalTrips(12 + (i * 5))
                        .latitude(41.8781 + (i * 0.01))
                        .longitude(-87.6298 - (i * 0.01))
                        .notes("Seeded profile for driver " + names[i])
                        .build());
            }

            driverRepository.saveAll(mockDrivers);
            System.out.println("Successfully seeded " + mockDrivers.size() + " drivers.");
        }
    }
}
