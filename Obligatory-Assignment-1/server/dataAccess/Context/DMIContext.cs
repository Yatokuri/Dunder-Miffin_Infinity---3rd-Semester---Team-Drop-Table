using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using dataAccess.Models;

namespace dataAccess;

public partial class DMIContext : DbContext
{
    public DMIContext(DbContextOptions<DMIContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderEntry> OrderEntries { get; set; }

    public virtual DbSet<Paper> Papers { get; set; }

    public virtual DbSet<Property> Properties { get; set; }

}